# Koinara Ecosystem Portal Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `koinara.xyz` into an ecosystem-first homepage and product navigation layer while keeping existing protocol workflows accessible underneath.

**Architecture:** Keep the current `site/` React/Vite app, but introduce a shared ecosystem data module so `Landing`, `Marketplace`, and `Proova` all use the same product/resource definitions. Rework the landing page into an ecosystem portal, then add cross-links and compliance messaging to internal product surfaces without breaking existing mission-flow routes.

**Tech Stack:** React 18, React Router, Vite, plain CSS, lightweight Node smoke scripts, Playwright CLI for visual verification

---

## File Map

- Create: `site/src/lib/ecosystem.js`
  - Shared first-party product metadata, protocol resource links, network badges, and partner-card definitions
- Create: `site/scripts/check-ecosystem-data.mjs`
  - Lightweight Node smoke test for ecosystem metadata integrity
- Modify: `site/src/pages/Landing.jsx`
  - Replace protocol-first landing composition with ecosystem portal structure
- Modify: `site/src/pages/landing.css`
  - Add layout and card styles for ecosystem hero, product grid, protocol resources, and core tools
- Modify: `site/src/components/Navbar.jsx`
  - Make navigation ecosystem-first while preserving marketplace/dashboard routes
- Modify: `site/src/pages/Marketplace.jsx`
  - Add legal notice near the primary CTA area and add ecosystem partner cards
- Modify: `site/src/pages/Proova.jsx`
  - Add ecosystem partner cards and explicit Koinara ecosystem relationship copy
- Modify: `site/src/pages/proova.css`
  - Style the new partner section and any ecosystem-linked Proova additions
- Optional modify: `site/src/App.jsx`
  - Only if routing or footer structure needs small adjustments for resource links

## Task 1: Add Shared Ecosystem Metadata

**Files:**
- Create: `site/src/lib/ecosystem.js`
- Create: `site/scripts/check-ecosystem-data.mjs`

- [ ] **Step 1: Write the failing metadata smoke test**

```js
// site/scripts/check-ecosystem-data.mjs
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
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: FAIL because `site/src/lib/ecosystem.js` does not exist yet

- [ ] **Step 3: Write the minimal metadata module**

```js
// site/src/lib/ecosystem.js
export const NETWORK_BADGES = [
  { key: "worldland", label: "Worldland", value: "Chain 103" },
  { key: "base", label: "Base", value: "Trade / Demo Surface" },
]

export const ECOSYSTEM_PRODUCTS = [
  { slug: "market", title: "OpenClaw Agent Market", href: "/marketplace", kind: "internal", state: "live" },
  { slug: "proova", title: "Proova", href: "/proova", kind: "internal", state: "live" },
  { slug: "agent-id-card", title: "Agent ID CARD", href: "https://www.agentidcard.org/", kind: "external", state: "live" },
  { slug: "the-4-path", title: "The 4 Path", href: "https://the4path-deploy.vercel.app/", kind: "external", state: "live" },
  { slug: "name-worldland", title: "Name-WorldLand", href: "https://name-worldland.vercel.app", kind: "external", state: "live" },
  { slug: "torqr", title: "Torqr", href: "/#torqr", kind: "internal", state: "coming-soon" },
]

export const PROTOCOL_RESOURCES = [
  { slug: "tokenomics", title: "Tokenomics", href: "/tokenomics", kind: "internal" },
  { slug: "trade-koin", title: "Trade KOIN / Uniswap", href: "/#trade-koin", kind: "internal" },
]

export function getInternalPartners(currentSlug) {
  return ECOSYSTEM_PRODUCTS.filter((item) => item.slug !== currentSlug)
}
```

- [ ] **Step 4: Run the smoke test to verify it passes**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: PASS with no output

- [ ] **Step 5: Commit**

```bash
git add site/src/lib/ecosystem.js site/scripts/check-ecosystem-data.mjs
git commit -m "feat: add ecosystem metadata module"
```

## Task 2: Rebuild the Landing Page as an Ecosystem Portal

**Files:**
- Modify: `site/src/pages/Landing.jsx`
- Modify: `site/src/pages/landing.css`
- Modify: `site/src/components/Navbar.jsx`
- Test: `site/scripts/check-ecosystem-data.mjs`

- [ ] **Step 1: Update the navbar labels and landing navigation targets**

Implementation notes:
- keep `/marketplace`, `/providers`, `/submit`, `/dashboard`, `/proova`
- shift landing nav anchors toward ecosystem sections such as `#products`, `#resources`, `#core-tools`
- keep wallet/connect controls intact

- [ ] **Step 2: Replace the landing hero copy with ecosystem-first messaging**

Implementation notes:
- headline should read `Koinara Ecosystem`
- add supporting line `Powered by Koinara Protocol`
- show visible `Worldland` and `Base` badges
- CTA priority should be product discovery first, protocol workflow second

- [ ] **Step 3: Add the featured product grid**

Implementation notes:
- render from `ECOSYSTEM_PRODUCTS`
- external products open external URLs
- internal products use `Link`
- show clear state chips such as `Live`, `External`, `Inside Koinara`, `Coming Soon`
- OpenClaw card should explain Mission Board as the core workflow

- [ ] **Step 4: Add ecosystem overview and protocol resource sections**

Implementation notes:
- ecosystem overview should explain relationships among Koinara Protocol, OpenClaw, Agent ID CARD, and Proova
- protocol resources should include `Tokenomics` and `Trade KOIN / Uniswap`
- if a final internal route is not ready, keep the card structure and wire the best-known destination without blocking the landing refresh

- [ ] **Step 5: Move protocol operations into a `Core Tools` section**

Implementation notes:
- include Guide, Marketplace, Providers, Dashboard
- visually separate this section from the featured product grid
- keep these routes functional and discoverable

- [ ] **Step 6: Run the metadata smoke test**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: PASS

- [ ] **Step 7: Run a production build**

Run: `npm run build`
Working directory: `site`
Expected: PASS and `dist/` output generated

- [ ] **Step 8: Commit**

```bash
git add site/src/pages/Landing.jsx site/src/pages/landing.css site/src/components/Navbar.jsx
git commit -m "feat: turn landing page into ecosystem portal"
```

## Task 3: Add OpenClaw Market Legal Notice and Partner Links

**Files:**
- Modify: `site/src/pages/Marketplace.jsx`
- Modify: `site/src/index.css` or `site/src/pages/landing.css` only if shared utility classes are truly needed
- Test: `site/scripts/check-ecosystem-data.mjs`

- [ ] **Step 1: Write the failing expectation into the smoke test**

Extend `site/scripts/check-ecosystem-data.mjs` with:

```js
import fs from "node:fs"

const marketplaceSource = fs.readFileSync(new URL("../src/pages/Marketplace.jsx", import.meta.url), "utf8")
assert.equal(marketplaceSource.includes("applicable local laws"), true)
assert.equal(marketplaceSource.includes("Ecosystem Partners"), true)
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: FAIL because the Marketplace source does not yet contain the required text

- [ ] **Step 3: Add the legal caution notice**

Implementation notes:
- place it near the main marketplace header / CTA area
- use strong warning styling
- include both ideas:
  - users must comply with applicable local laws and regulations
  - users must not access or use the service where such use is prohibited

- [ ] **Step 4: Add the `Ecosystem Partners` block**

Implementation notes:
- render partner cards from `getInternalPartners("market")`
- include one-click navigation to Proova and the external products
- preserve job list/filter behavior below

- [ ] **Step 5: Re-run the smoke test**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: PASS

- [ ] **Step 6: Run a production build**

Run: `npm run build`
Working directory: `site`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add site/src/pages/Marketplace.jsx site/scripts/check-ecosystem-data.mjs
git commit -m "feat: add market legal notice and partner links"
```

## Task 4: Add Proova Ecosystem Partner Navigation

**Files:**
- Modify: `site/src/pages/Proova.jsx`
- Modify: `site/src/pages/proova.css`
- Test: `site/scripts/check-ecosystem-data.mjs`

- [ ] **Step 1: Write the failing expectation into the smoke test**

Extend `site/scripts/check-ecosystem-data.mjs` with:

```js
const proovaSource = fs.readFileSync(new URL("../src/pages/Proova.jsx", import.meta.url), "utf8")
assert.equal(proovaSource.includes("Ecosystem Partners"), true)
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: FAIL because Proova does not yet contain the partner section

- [ ] **Step 3: Add partner cards and ecosystem relationship copy to Proova**

Implementation notes:
- keep existing Proova content and SEO behavior
- add a dedicated section near the lower half of the page
- show Koinara ecosystem context and one-click partner links
- clearly indicate that Agent ID CARD is the identity/authentication layer tied to mission claiming

- [ ] **Step 4: Add CSS for the new partner section**

Implementation notes:
- reuse current Proova card language
- keep desktop/mobile spacing consistent

- [ ] **Step 5: Re-run the smoke test**

Run: `node site/scripts/check-ecosystem-data.mjs`
Expected: PASS

- [ ] **Step 6: Run a production build**

Run: `npm run build`
Working directory: `site`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add site/src/pages/Proova.jsx site/src/pages/proova.css site/scripts/check-ecosystem-data.mjs
git commit -m "feat: connect proova to ecosystem partner nav"
```

## Task 5: Visual Verification and Final Cleanup

**Files:**
- No required code changes unless verification reveals issues
- Artifacts: `site/output/playwright/`

- [ ] **Step 1: Run the production build one more time**

Run: `npm run build`
Working directory: `site`
Expected: PASS

- [ ] **Step 2: Start preview server**

Run: `npm run preview -- --host 127.0.0.1 --port 4177`
Working directory: `site`
Expected: local preview available at `http://127.0.0.1:4177`

- [ ] **Step 3: Capture landing page screenshots**

Use Playwright CLI to capture:
- desktop full-page screenshot of `/`
- mobile full-page screenshot of `/`

Expected checks:
- ecosystem hero reads clearly
- featured products visible above core tools
- network badges visible

- [ ] **Step 4: Capture Marketplace and Proova screenshots**

Use Playwright CLI to capture:
- `/marketplace`
- `/proova`

Expected checks:
- Marketplace warning block is visible near the top action area
- partner cards are present and readable
- Proova partner section is visible and integrated cleanly

- [ ] **Step 5: Review console and route behavior**

Check:
- no new runtime errors
- external product cards open correct external URLs
- internal product cards route correctly

- [ ] **Step 6: Commit any final polish if needed**

```bash
git add site/src site/output/playwright
git commit -m "fix: polish ecosystem portal phase 1"
```

Only create this commit if verification reveals issues that require code changes. Do not commit screenshot artifacts unless explicitly requested.
