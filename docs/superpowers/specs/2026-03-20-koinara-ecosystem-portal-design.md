# Koinara Ecosystem Portal Design

Date: 2026-03-20
Scope: `site/` frontend on `koinara.xyz`
Status: Draft for user review

## Goal

Reposition `koinara.xyz` from a protocol-app-first interface into an ecosystem portal.

The public brand should read as:

> Koinara Ecosystem
> Powered by Koinara Protocol

The site should introduce Koinara as the umbrella ecosystem brand, while still preserving Koinara Protocol as the technical foundation underneath the experience.

## Product Model

Initial portal scope includes only first-party products controlled by the team.

### Internal products

- OpenClaw Agent Market
  - Represents the existing marketplace and mission-flow functionality already inside `koinara.xyz`
  - Includes the currently active Mission Board flow as its core in-site experience
- Proova
  - Should have a dedicated page inside `koinara.xyz`
- Torqr
  - Still in development
  - Should be represented in the portal as `Coming Soon`
  - May later receive a dedicated page inside `koinara.xyz`

### External products

- Agent ID CARD
  - External URL: `https://www.agentidcard.org/`
  - Represents the identity/authentication layer connected to agent participation
- The 4 Path
  - External URL: `https://the4path-deploy.vercel.app/`
- Name-WorldLand
  - External URL: `https://name-worldland.vercel.app`

### Protocol resources

- Tokenomics
  - Already implemented in a separate Koinara surface
  - Should be exposed from the ecosystem portal as a protocol resource, not as a featured product
- Trade KOIN / Uniswap
  - Should be exposed as a token-access resource
  - This is a protocol utility/resource, not a standalone ecosystem product

## Core Positioning

### Brand hierarchy

- `Koinara Ecosystem` is the outward-facing brand
- `Koinara Protocol` is the infrastructure/foundation layer
- Individual products are presented as ecosystem products, not as unrelated standalone pages

### Messaging rule

The homepage should communicate this order:

1. The ecosystem exists
2. The products inside it are real and active
3. Koinara Protocol powers the system underneath
4. The ecosystem operates across the currently relevant network surfaces

The homepage should no longer feel like a protocol operations console with a few product links attached. It should feel like a curated ecosystem front door.

## Recommended Information Architecture

### Approach chosen

Use an ecosystem-first homepage with protocol tooling moved below the product layer.

Why this approach:

- It strengthens the umbrella brand
- It gives room to add more products later without changing the site philosophy
- It avoids presenting every feature as a protocol-only workflow
- It lets existing protocol tools still exist without dominating the first impression

### Homepage structure

1. Hero
   - Headline: `Koinara Ecosystem`
   - Subline: ecosystem-first description
   - Support line: `Powered by Koinara Protocol`
   - CTA area should prioritize product discovery over protocol operations
   - Include visible network context such as `Worldland` and `Base` badges

2. Featured Products
   - OpenClaw Agent Market
   - Proova
   - Agent ID CARD
   - The 4 Path
   - Name-WorldLand
   - Torqr (`Coming Soon`)

3. Ecosystem Overview
   - Short explanation of how the products relate to the shared Koinara foundation
   - This can be a visual map, layered card system, or network diagram
   - Explicitly show the relationship between:
     - Koinara Protocol
     - OpenClaw Agent Market / Mission Board
     - Agent ID CARD as identity/auth layer
     - Proova as verification layer

4. Protocol Resources
   - Tokenomics
   - Trade KOIN / Uniswap
   - Network context and supporting protocol links

5. Core Tools
   - Existing protocol-facing routes such as:
     - Guide
     - Jobs / Market flow
     - Providers
     - Dashboard
   - These remain available, but should appear after the ecosystem/product layer

6. Footer / cross-navigation
   - Preserve direct access to core docs and protocol utility links
   - Preserve dual-chain visibility where appropriate

## Link Behavior Rules

### Product cards on the homepage

- If a product already has a public external site, the product card should open that external site directly
- If a product does not have a public external site, the product card should open its internal `koinara.xyz` page
- If a product is not yet launched, the product card should still exist with a clear state such as `Coming Soon`

### Initial routing expectations

- OpenClaw Agent Market -> existing internal Koinara market flow
  - Mission Board is treated as the primary workflow inside this product, not as a separate featured product card in Phase 1
- Proova -> internal page on `koinara.xyz`
- Agent ID CARD -> external site
- The 4 Path -> external site
- Name-WorldLand -> external site
- Torqr -> internal teaser or coming-soon destination
- Tokenomics -> protocol resource link
- Trade KOIN / Uniswap -> protocol resource link

## Product Page Rules

Every internal product page should include an `Ecosystem Partners` block.

That block should:

- show the other ecosystem products as partner cards
- clearly label state where useful (`Live`, `External`, `Coming Soon`, `Inside Koinara`)
- allow one-click navigation to the linked destination

This creates a network effect inside the portal instead of leaving each product page isolated.

### Important limitation

Partner navigation inside external sites such as Agent ID CARD, The 4 Path, and Name-WorldLand is **not** part of the `koinara.xyz` implementation by default.

To add partner links inside those sites, their own repositories/pages must also be updated separately.

Therefore the rollout should be:

1. Build the ecosystem structure and partner cross-links inside `koinara.xyz`
2. Later propagate the same partner navigation pattern into external product sites if desired

## Visual Direction

The site should shift from a pure protocol-dashboard feeling toward a curated ecosystem portal while keeping the existing visual language compatible with the Koinara identity.

Design cues to preserve:

- dark foundation
- strong contrast
- neon/mint/ice-blue accent language
- product cards with clear states and scan-friendly structure

Design cues to introduce:

- stronger product grouping
- clearer separation between ecosystem products and protocol tools
- more narrative framing at the top of the homepage
- partner/product network language on internal product pages

## Content Rules

### Homepage copy style

- ecosystem-first
- simple and brand-forward
- avoid overwhelming protocol jargon in the first screen

### Product copy style

- each product gets a one-line purpose
- each product makes its relationship to Koinara explicit
- each internal page should reinforce that it is part of the Koinara ecosystem
- Agent ID CARD should be described not only as a partner product, but as the identity/authentication layer tied to mission participation

### Network information rule

- The portal should acknowledge the current dual-surface context of `Worldland` and `Base`
- This should appear at the homepage level, not only inside low-level protocol pages
- Network context should help users understand where protocol functions, token resources, and market/trade surfaces live

### Token and trade resource rule

- `Tokenomics` and `Trade KOIN / Uniswap` belong in protocol-resource presentation, not in the featured products list
- They should be visible from the portal homepage, but visually separated from ecosystem products
- Their placement should support discovery without confusing token utilities with product brands

### Legal notice rule

- `Torqr` already has its own legal caution pattern outside this rollout
- `OpenClaw Agent Market` should add a visible caution notice near the primary action area
- The notice should communicate that users must comply with applicable local laws and must not access or use the service where such use is prohibited
- This should be presented as a clear warning block near the relevant CTA, not buried only in footer text

## Phase Plan

### Phase 1

- Rework homepage into ecosystem-first information architecture
- Keep protocol tools, but move them below the product layer
- Ensure Proova is represented as an internal product page
- Add ecosystem product cards with correct internal/external behavior
- Add partner blocks on internal Koinara product pages
- Add the legal caution notice to the OpenClaw Agent Market surface inside `koinara.xyz`
- Add homepage-level network badges/context for `Worldland` and `Base`
- Add protocol-resource access for `Tokenomics` and `Trade KOIN / Uniswap`
- Clarify Mission Board as the active workflow inside OpenClaw Agent Market
- Clarify Agent ID CARD as the identity/authentication layer connected to mission claiming

### Phase 2

- Add or refine internal product pages for products without external sites
- Add richer ecosystem map/diagram treatment
- Update external product sites to include reciprocal partner navigation

## Open Assumptions

- Only first-party products are included in the initial portal
- External/community products are intentionally excluded for now
- `OpenClaw Agent Market` refers to the existing marketplace functionality already inside `koinara.xyz`
- `Mission Board` is treated as the flagship workflow inside OpenClaw Agent Market rather than a separate first-screen product card
- `Torqr` is not launch-ready and should be represented as in development
- `Tokenomics` remains a protocol resource rather than a featured ecosystem product

## Success Criteria

- The homepage reads primarily as an ecosystem portal, not a protocol console
- Users can immediately see the ecosystem product set
- Existing protocol tools remain accessible but no longer dominate the first impression
- Internal product pages create cross-navigation between ecosystem products
- External products are reachable in one click from the Koinara portal
- Mission Board is still discoverable through the OpenClaw Agent Market path
- Worldland/Base context is visible at the portal level
- Tokenomics and Trade KOIN are reachable as protocol resources without being confused for products
