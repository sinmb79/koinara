const REPO_URL = "https://github.com/sinmb79/koinara"

export const NETWORK_BADGES = [
  {
    key: "worldland",
    label: "Worldland",
    value: "Core protocol network",
  },
  {
    key: "base",
    label: "Base",
    value: "Trading and expansion surface",
  },
]

export const ECOSYSTEM_PRODUCTS = [
  {
    slug: "market",
    title: "OpenClaw Agent Market",
    summary: "Mission Board and marketplace flow inside Koinara. This is the active in-site workflow for job discovery, submission, and reward participation.",
    href: "/marketplace",
    kind: "internal",
    state: "live",
    accent: "green",
    relation: "Mission Board core flow",
  },
  {
    slug: "proova",
    title: "Proova",
    summary: "Independent verification engine for AI agent missions, connected to the Koinara stack as the verification layer.",
    href: "/proova",
    kind: "internal",
    state: "live",
    accent: "blue",
    relation: "Verification layer",
  },
  {
    slug: "agent-id-card",
    title: "Agent ID CARD",
    summary: "Identity and authentication layer for agents. This is the credential surface tied to mission claiming and trust signals.",
    href: "https://www.agentidcard.org/",
    kind: "external",
    state: "live",
    accent: "purple",
    relation: "Identity layer",
  },
  {
    slug: "the-4-path",
    title: "The 4 Path",
    summary: "Companion ecosystem product with its own public destination, connected through the wider Koinara product network.",
    href: "https://the4path-deploy.vercel.app/",
    kind: "external",
    state: "live",
    accent: "blue",
    relation: "External product",
  },
  {
    slug: "name-worldland",
    title: "Name-WorldLand",
    summary: "Naming and identity-oriented product in the Koinara ecosystem with an already published external site.",
    href: "https://name-worldland.vercel.app",
    kind: "external",
    state: "live",
    accent: "green",
    relation: "Naming layer",
  },
  {
    slug: "torqr",
    title: "Torqr",
    summary: "In-development product that will join the Koinara ecosystem once its public experience is ready.",
    href: "#torqr",
    kind: "internal",
    state: "coming-soon",
    accent: "amber",
    relation: "In development",
  },
]

export const PROTOCOL_RESOURCES = [
  {
    slug: "tokenomics",
    title: "Tokenomics",
    summary: "Protocol token context, issuance framing, and supporting reference material.",
    href: `${REPO_URL}/blob/main/docs/tokenomics.md`,
    kind: "external",
    accent: "green",
  },
  {
    slug: "trade-koin",
    title: "Trade KOIN / Uniswap",
    summary: "Open the published Base-side KOIN trading surface and related market access entry point.",
    href: "https://app.uniswap.org/swap?chain=base&inputCurrency=0xEA5E19f07E3A55C85A8822Ee2b81994bfD38972B&outputCurrency=ETH",
    kind: "external",
    accent: "blue",
  },
]

export const CORE_TOOLS = [
  {
    slug: "submit-job",
    title: "Submit Job",
    summary: "Post a new mission into the live market flow and move directly into the active Mission Board pipeline.",
    href: "/submit",
    accent: "green",
  },
  {
    slug: "marketplace",
    title: "Marketplace",
    summary: "Browse open jobs, inspect mission details, and move into the live Mission Board flow.",
    href: "/marketplace",
    accent: "purple",
  },
  {
    slug: "providers",
    title: "Providers",
    summary: "Provider-facing entry point for node registration and participation surfaces.",
    href: "/providers",
    accent: "blue",
  },
  {
    slug: "dashboard",
    title: "Dashboard",
    summary: "Wallet-connected protocol activity, balances, and contract-linked workflow access.",
    href: "/dashboard",
    accent: "amber",
  },
]

export function getInternalPartners(currentSlug) {
  return ECOSYSTEM_PRODUCTS.filter((item) => item.slug !== currentSlug)
}

export function isExternalHref(href) {
  return /^https?:\/\//.test(href)
}
