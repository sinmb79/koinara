export const WORLDLAND = {
  chainId:     103,
  chainIdHex:  '0x67',
  chainName:   'WorldLand Mainnet',
  nativeCurrency: { name: 'WorldLand', symbol: 'WLC', decimals: 18 },
  rpcUrls:            ['https://seoul.worldland.foundation'],
  blockExplorerUrls:  ['https://scan.worldland.foundation'],
}

export const EXPLORER = 'https://scan.worldland.foundation'
export const txUrl   = (hash) => `${EXPLORER}/tx/${hash}`
export const addrUrl = (addr) => `${EXPLORER}/address/${addr}`

// Off-chain storage key prefix (localStorage as IPFS substitute in dev)
export const OC_JOBS = 'koinara_jobs_v1'
export const OC_RESPONSES = (jobId) => `koinara_resp_${jobId}`
