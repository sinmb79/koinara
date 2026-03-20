import assert from "node:assert/strict"
import fs from "node:fs"
import {
  CORE_TOOLS,
  ECOSYSTEM_PRODUCTS,
  PROTOCOL_RESOURCES,
  NETWORK_BADGES,
  getInternalPartners,
  isExternalHref,
} from "../src/lib/ecosystem.js"

assert.equal(Array.isArray(ECOSYSTEM_PRODUCTS), true)
assert.equal(Array.isArray(CORE_TOOLS), true)
assert.equal(Array.isArray(PROTOCOL_RESOURCES), true)
assert.equal(Array.isArray(NETWORK_BADGES), true)
assert.equal(ECOSYSTEM_PRODUCTS.some((item) => item.slug === "market"), true)
assert.equal(ECOSYSTEM_PRODUCTS.some((item) => item.slug === "proova"), true)
assert.equal(ECOSYSTEM_PRODUCTS.some((item) => item.slug === "torqr"), true)
assert.equal(PROTOCOL_RESOURCES.some((item) => item.slug === "tokenomics"), true)
assert.equal(PROTOCOL_RESOURCES.some((item) => item.slug === "trade-koin"), true)
assert.equal(getInternalPartners("market").length > 0, true)
assert.equal(isExternalHref("https://koinara.xyz"), true)

const market = ECOSYSTEM_PRODUCTS.find((item) => item.slug === "market")
assert.equal(market?.href, "https://koinara.xyz")
assert.equal(market?.kind, "external")

assert.equal(
  CORE_TOOLS.every((item) => item.kind === "external" && isExternalHref(item.href)),
  true,
)

const marketplaceSource = fs.readFileSync(new URL("../src/pages/Marketplace.jsx", import.meta.url), "utf8")
assert.equal(marketplaceSource.includes('window.location.href = TARGET_URL'), true)
assert.equal(marketplaceSource.includes('https://koinara.xyz/missions'), true)

const proovaSource = fs.readFileSync(new URL("../src/pages/Proova.jsx", import.meta.url), "utf8")
assert.equal(proovaSource.includes("Ecosystem Partners"), true)
assert.equal(proovaSource.includes("isExternalHref(href)"), true)

const landingSource = fs.readFileSync(new URL("../src/pages/Landing.jsx", import.meta.url), "utf8")
assert.equal(landingSource.includes('item.kind === "external" ? labels.buttonExternal : labels.buttonInternal'), true)
assert.equal(landingSource.includes('href="https://koinara.xyz"'), true)

const navbarSource = fs.readFileSync(new URL("../src/components/Navbar.jsx", import.meta.url), "utf8")
assert.equal(navbarSource.includes('"/marketplace"'), false)
assert.equal(navbarSource.includes('"/providers"'), false)
assert.equal(navbarSource.includes('"/dashboard"'), false)
