import { create } from 'zustand'
import { ethers } from 'ethers'
import { WORLDLAND, OC_JOBS, OC_RESPONSES } from './chain.js'
import {
  ADDRESSES,
  REGISTRY_ABI, VERIFIER_ABI, DISTRIBUTOR_ABI, KOIN_ABI, NODE_REGISTRY_ABI,
  JOB_STATE, JOB_TYPE,
} from '../abi/index.js'

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) => ethers.formatEther(v ?? 0n)
const toHash = (s) => BigInt(ethers.keccak256(ethers.toUtf8Bytes(s)))

// ── store ─────────────────────────────────────────────────────────────────────
const useStore = create((set, get) => ({

  // language
  lang: localStorage.getItem('koinara_lang') || 'ko',
  setLang: (lang) => { localStorage.setItem('koinara_lang', lang); set({ lang }) },

  // wallet
  address: null,
  chainId: null,
  isConnecting: false,
  isCorrectChain: false,

  // contract instances (with signer)
  registry: null,
  verifier: null,
  distributor: null,
  koin: null,
  nodeReg: null,

  // read-only provider (no wallet needed for reads)
  readProvider: null,
  registryRO: null,
  verifierRO: null,
  koinRO: null,

  // user balances
  wlcBalance: '0',
  koinBalance: '0',
  pendingReward: '0',

  // data
  jobs: [],
  isLoadingJobs: false,
  lastBlock: null,

  // ── init read-only provider on app start ────────────────────────────────
  initReadOnly: () => {
    try {
      const rp = new ethers.JsonRpcProvider(WORLDLAND.rpcUrls[0])
      const registryRO  = new ethers.Contract(ADDRESSES.registry,  REGISTRY_ABI,  rp)
      const verifierRO  = new ethers.Contract(ADDRESSES.verifier,  VERIFIER_ABI,  rp)
      const koinRO      = new ethers.Contract(ADDRESSES.koin,      KOIN_ABI,      rp)
      set({ readProvider: rp, registryRO, verifierRO, koinRO })
    } catch (e) {
      console.warn('read-only provider init failed:', e.message)
    }
  },

  // ── connect MetaMask ────────────────────────────────────────────────────
  connect: async () => {
    if (!window.ethereum) throw new Error('MetaMask가 설치되어 있지 않습니다.')
    set({ isConnecting: true })
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer  = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)
      const isCorrectChain = chainId === WORLDLAND.chainId

      const registry   = new ethers.Contract(ADDRESSES.registry,    REGISTRY_ABI,   signer)
      const verifier   = new ethers.Contract(ADDRESSES.verifier,    VERIFIER_ABI,   signer)
      const distributor = new ethers.Contract(ADDRESSES.distributor, DISTRIBUTOR_ABI, signer)
      const koin        = new ethers.Contract(ADDRESSES.koin,        KOIN_ABI,        signer)
      const nodeReg     = new ethers.Contract(ADDRESSES.nodeReg,     NODE_REGISTRY_ABI, signer)

      set({ address, chainId, isConnecting: false, isCorrectChain,
            registry, verifier, distributor, koin, nodeReg })

      get().refreshBalances()

      window.ethereum.on('accountsChanged', (a) =>
        a.length ? get().connect() : get().disconnect())
      window.ethereum.on('chainChanged', () => window.location.reload())
    } catch (e) {
      set({ isConnecting: false })
      throw e
    }
  },

  // ── switch to Worldland ─────────────────────────────────────────────────
  switchChain: async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: WORLDLAND.chainIdHex }],
      })
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: WORLDLAND.chainIdHex,
            chainName: WORLDLAND.chainName,
            nativeCurrency: WORLDLAND.nativeCurrency,
            rpcUrls: WORLDLAND.rpcUrls,
            blockExplorerUrls: WORLDLAND.blockExplorerUrls,
          }],
        })
      } else throw e
    }
  },

  disconnect: () => set({
    address: null, chainId: null, isCorrectChain: false,
    registry: null, verifier: null, distributor: null, koin: null, nodeReg: null,
    wlcBalance: '0', koinBalance: '0', pendingReward: '0',
  }),

  // ── balances ────────────────────────────────────────────────────────────
  refreshBalances: async () => {
    const { address, koin, distributor } = get()
    if (!address) return
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const [wlc, koinBal, pending] = await Promise.all([
        provider.getBalance(address),
        koin?.balanceOf(address).catch(() => 0n),
        distributor?.getPendingReward(address).catch(() => 0n),
      ])
      set({ wlcBalance: fmt(wlc), koinBalance: fmt(koinBal ?? 0n), pendingReward: fmt(pending ?? 0n) })
    } catch (e) { console.warn('balance refresh:', e.message) }
  },

  // ── load jobs (on-chain + off-chain merge) ───────────────────────────────
  loadJobs: async () => {
    const { registryRO, registry } = get()
    const src = registryRO || registry
    if (!src) return
    set({ isLoadingJobs: true })
    try {
      const count = Number(await src.jobCounter().catch(() => 0n))
      const offChain = JSON.parse(localStorage.getItem(OC_JOBS) || '{}')
      const ids = Array.from({ length: Math.min(count, 30) }, (_, i) => count - i).filter(i => i > 0)

      const jobs = await Promise.all(ids.map(async (id) => {
        try {
          const j = await src.getJob(id)
          return {
            id: Number(j.id ?? id),
            requester: j.requester,
            requestHash: j.requestHash?.toString(),
            schemaHash: j.schemaHash?.toString(),
            deadline: Number(j.deadline),
            jobType: Number(j.jobType),
            premiumReward: j.premiumReward,
            state: Number(j.state),
            // merge off-chain metadata
            title:   offChain[id]?.title   ?? `작업 #${id}`,
            request: offChain[id]?.request ?? '',
            schema:  offChain[id]?.schema  ?? '',
          }
        } catch { return null }
      }))

      set({ jobs: jobs.filter(Boolean), isLoadingJobs: false })
    } catch (e) {
      console.warn('loadJobs:', e.message)
      set({ isLoadingJobs: false })
    }
  },

  // ── submit job ───────────────────────────────────────────────────────────
  submitJob: async ({ title, request, schema, jobType, deadlineHours, premiumEth }) => {
    const { registry, address } = get()
    if (!registry) throw new Error('지갑을 먼저 연결하세요.')

    const requestHash = toHash(request)
    const schemaHash  = toHash(schema || 'free-form')
    const deadline    = BigInt(Math.floor(Date.now() / 1000) + Number(deadlineHours) * 3600)
    const typeEnum    = { simple: 0, general: 1, collective: 2 }[jobType] ?? 0
    const premium     = ethers.parseEther(String(premiumEth || '0'))

    const tx      = await registry.submitJob(requestHash, schemaHash, deadline, typeEnum, premium, { value: premium })
    const receipt = await tx.wait()

    // parse jobId from event
    let jobId = null
    for (const log of receipt.logs) {
      try {
        const parsed = registry.interface.parseLog(log)
        if (parsed?.name === 'JobSubmitted') { jobId = Number(parsed.args.jobId); break }
      } catch {}
    }

    // save off-chain metadata
    if (jobId !== null) {
      const store = JSON.parse(localStorage.getItem(OC_JOBS) || '{}')
      store[jobId] = { title, request, schema, requester: address, createdAt: Date.now() }
      localStorage.setItem(OC_JOBS, JSON.stringify(store))
    }

    get().loadJobs()
    return { tx, receipt, jobId }
  },

  // ── submit response ──────────────────────────────────────────────────────
  submitResponse: async ({ jobId, responseText }) => {
    const { verifier, address } = get()
    if (!verifier) throw new Error('지갑을 먼저 연결하세요.')

    const responseHash = toHash(responseText)

    // save off-chain
    const key   = OC_RESPONSES(jobId)
    const store = JSON.parse(localStorage.getItem(key) || '[]')
    store.push({ provider: address, responseText, submittedAt: Date.now() })
    localStorage.setItem(key, JSON.stringify(store))

    const tx      = await verifier.submitResponse(jobId, responseHash, true)
    const receipt = await tx.wait()
    return { tx, receipt }
  },

  // ── claim reward ─────────────────────────────────────────────────────────
  claimReward: async (jobId) => {
    const { distributor } = get()
    if (!distributor) throw new Error('지갑을 먼저 연결하세요.')
    const tx      = await distributor.claimReward(jobId)
    const receipt = await tx.wait()
    get().refreshBalances()
    return { tx, receipt }
  },

  // ── register as node ─────────────────────────────────────────────────────
  registerNode: async ({ nodeType, endpoint }) => {
    const { nodeReg } = get()
    if (!nodeReg) throw new Error('지갑을 먼저 연결하세요.')
    const tx      = await nodeReg.registerNode(nodeType, endpoint)
    const receipt = await tx.wait()
    return { tx, receipt }
  },

  // ── get poi for job ───────────────────────────────────────────────────────
  getPOI: async (jobId) => {
    const { verifierRO, verifier } = get()
    const src = verifierRO || verifier
    if (!src) return null
    try {
      const p = await src.getPOI(jobId)
      return { exists: p.exists, poiHash: p.poiHash, provider: p.provider, acceptedAt: Number(p.acceptedAt) }
    } catch { return null }
  },

  // ── get responses for job ────────────────────────────────────────────────
  getResponses: async (jobId) => {
    const { verifierRO, verifier } = get()
    const src = verifierRO || verifier
    if (!src) return []
    try {
      const count = Number(await src.getResponseCount(jobId))
      const list  = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          src.getResponse(jobId, i).catch(() => null)
        )
      )
      const offChain = JSON.parse(localStorage.getItem(OC_RESPONSES(jobId)) || '[]')
      return list.filter(Boolean).map((r, i) => ({
        provider:    r.provider,
        responseHash: r.responseHash?.toString(),
        submittedAt: Number(r.submittedAt),
        approvalCount: Number(r.approvalCount),
        accepted:    r.accepted,
        text: offChain[i]?.responseText ?? '',
      }))
    } catch { return [] }
  },
}))

export default useStore
