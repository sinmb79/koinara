import assert from "node:assert/strict"
import {
  ECOSYSTEM_PRODUCTS,
  PROTOCOL_RESOURCES,
  NETWORK_BADGES,
  getInternalPartners,
} from "../src/lib/ecosystem.js"

assert.equal(Array.isArray(ECOSYSTEM_PRODUCTS), true)
assert.equal(Array.isArray(PROTOCOL_RESOURCES), true)
assert.equal(Array.isArray(NETWORK_BADGES), true)
assert.equal(ECOSYSTEM_PRODUCTS.some((item) => item.slug === "market"), true)
assert.equal(ECOSYSTEM_PRODUCTS.some((item) => item.slug === "proova"), true)
assert.equal(ECOSYSTEM_PRODUCTS.some((item) => item.slug === "torqr"), true)
assert.equal(PROTOCOL_RESOURCES.some((item) => item.slug === "tokenomics"), true)
assert.equal(PROTOCOL_RESOURCES.some((item) => item.slug === "trade-koin"), true)
assert.equal(getInternalPartners("market").length > 0, true)
