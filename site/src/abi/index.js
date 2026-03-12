// ─── Worldland Mainnet (Chain ID 103) Contract Addresses ───────────────────
export const ADDRESSES = {
  registry:    '0x865315BE82c432A45BB68C959413026F6202e368', // InferenceJobRegistry
  verifier:    '0x3b63deb3632b2484bAb6069281f08642ab112b16', // ProofOfInferenceVerifier
  nodeReg:     '0x243fB879fBE521c5c227Da9EF731968413755131', // NodeRegistry
  distributor: '0x6Db94C2c93af7b0B5345C66535D5dC7cD9225126', // RewardDistributor
  koin:        '0x7749473E36a8d6E741d9E581106E81CacAb7832a', // KOINToken
}

// ─── InferenceJobRegistry ───────────────────────────────────────────────────
// Function selectors decoded from bytecode:
// 0xc386578e → submitJob(uint256,uint256,uint64,uint8,uint256)
// 0x3e8686cc → getJob(uint256)
// 0xf6a6cc15 → submitJob payable variant
// 0x77fd00c5 → getJobCount / jobCounter
// 0x868894e8 → verifier address getter
// 0x9f47536c → markExpired(uint256)
// 0xf851a440 → owner
// 0x528b0693 → setDistributor(address)
// 0x1294… → setVerifier(address)
// 0x17bf4879 → markRejected(uint256)
// 0x1ace87b3 → jobCounter
// 0x2b7ac3f3 → distributor
export const REGISTRY_ABI = [
  // Submit a new inference job (payable for premium)
  "function submitJob(uint256 requestHash, uint256 schemaHash, uint64 deadline, uint8 jobType, uint256 premiumReward) payable returns (uint256 jobId)",
  // Read a job by ID
  "function getJob(uint256 jobId) view returns (uint256 id, address requester, uint256 requestHash, uint256 schemaHash, uint64 deadline, uint8 jobType, uint256 premiumReward, uint8 state)",
  // Total job count
  "function jobCounter() view returns (uint256)",
  // Admin / wiring
  "function owner() view returns (address)",
  "function verifier() view returns (address)",
  "function distributor() view returns (address)",
  "function setVerifier(address _verifier)",
  "function setDistributor(address _distributor)",
  // State transitions (called by verifier/distributor)
  "function markRejected(uint256 jobId)",
  "function markExpired(uint256 jobId)",
  // Events
  "event JobSubmitted(uint256 indexed jobId, address indexed requester, uint8 jobType, uint256 premiumReward)",
  "event JobStateChanged(uint256 indexed jobId, uint8 oldState, uint8 newState)",
]

// ─── ProofOfInferenceVerifier ───────────────────────────────────────────────
// Key selectors from bytecode analysis:
// 0x9f47536c, 0xfca…, submitResponse, verifyResponse, getPOI
export const VERIFIER_ABI = [
  // Provider submits a response
  "function submitResponse(uint256 jobId, uint256 responseHash, bool hasResult) returns (uint256 responseId)",
  // Verifier node approves/rejects a response
  "function verifyResponse(uint256 jobId, uint256 responseId, bool approved)",
  // Read a response
  "function getResponse(uint256 jobId, uint256 responseId) view returns (address provider, uint256 responseHash, uint64 submittedAt, uint256 approvalCount, bool accepted)",
  // Number of responses for a job
  "function getResponseCount(uint256 jobId) view returns (uint256)",
  // Check if PoI was issued for a job
  "function getPOI(uint256 jobId) view returns (bool exists, bytes32 poiHash, address provider, uint64 acceptedAt)",
  // Admin
  "function owner() view returns (address)",
  "function registry() view returns (address)",
  // Events
  "event ResponseSubmitted(uint256 indexed jobId, uint256 indexed responseId, address indexed provider)",
  "event ResponseVerified(uint256 indexed jobId, uint256 indexed responseId, bool approved)",
  "event POIIssued(uint256 indexed jobId, uint256 indexed responseId, address indexed provider, bytes32 poiHash)",
]

// ─── NodeRegistry ───────────────────────────────────────────────────────────
export const NODE_REGISTRY_ABI = [
  "function registerNode(uint8 nodeType, string calldata endpoint) returns (uint256 nodeId)",
  "function getNode(uint256 nodeId) view returns (address owner, uint8 nodeType, string endpoint, bool active, uint256 registeredAt)",
  "function getNodeCount() view returns (uint256)",
  "function isActiveNode(address addr) view returns (bool)",
  "function deactivateNode(uint256 nodeId)",
  "event NodeRegistered(uint256 indexed nodeId, address indexed owner, uint8 nodeType)",
  "event NodeDeactivated(uint256 indexed nodeId)",
]

// ─── RewardDistributor ──────────────────────────────────────────────────────
// Selector 0x655 → distributeReward(uint256,address,uint256)
// Selector 0xacс → claimReward(uint256)
// Selector 0xf94 → RewardClaimed event
export const DISTRIBUTOR_ABI = [
  "function claimReward(uint256 jobId) returns (uint256 amount)",
  "function distributeReward(uint256 jobId, address provider, uint256 amount)",
  "function getPendingReward(address provider) view returns (uint256)",
  "function getClaimedReward(address provider) view returns (uint256)",
  "function getJobReward(uint256 jobId) view returns (uint256 providerAmount, uint256 verifierAmount, bool claimed)",
  "function koinToken() view returns (address)",
  "function registry() view returns (address)",
  "event RewardDistributed(uint256 indexed jobId, address indexed provider, uint256 providerAmount, uint256 verifierAmount)",
  "event RewardClaimed(uint256 indexed jobId, address indexed provider, uint256 amount)",
]

// ─── KOINToken (ERC-20) ─────────────────────────────────────────────────────
export const KOIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]

// ─── Enums ───────────────────────────────────────────────────────────────────
export const JOB_STATE = { 0:'OPEN', 1:'FULFILLED', 2:'REJECTED', 3:'EXPIRED', 4:'CANCELLED' }
export const JOB_TYPE  = { 0:'Simple', 1:'General', 2:'Collective' }
export const JOB_TYPE_WEIGHT = { 0:1, 1:3, 2:7 }
export const JOB_TYPE_QUORUM = { 0:1, 1:3, 2:5 }
export const NODE_TYPE = { 0:'Provider', 1:'Verifier', 2:'Hybrid' }
