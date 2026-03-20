import { Link } from "react-router-dom"
import useStore from "../lib/store.js"
import {
  CORE_TOOLS,
  ECOSYSTEM_PRODUCTS,
  NETWORK_BADGES,
  PROTOCOL_RESOURCES,
  isExternalHref,
} from "../lib/ecosystem.js"
import "./landing.css"

const REPO_URL = "https://github.com/sinmb79/koinara"

const copy = {
  ko: {
    heroBadge: "KOINARA ECOSYSTEM | PHASE 1",
    title: "Koinara Ecosystem",
    subtitle:
      "Koinara는 Worldland 위에서 성장하는 프로토콜 기반 생태계입니다. 제품은 서로 연결되고, 프로토콜은 그 아래에서 시장·인증·검증·보상 구조를 지탱합니다.",
    support: "Powered by Koinara Protocol",
    primaryCta: "제품 보기",
    secondaryCta: "마켓 열기",
    tertiaryCta: "Proova 보기",
    stats: {
      products: "Products",
      networks: "Networks",
      resources: "Protocol Resources",
      tools: "Core Tools",
    },
    productsBadge: "Featured Products",
    productsTitle: "실제 서비스로 확장되는 생태계",
    productsDescription:
      "공개된 외부 사이트는 바로 이동하고, 내부 제품은 Koinara 안에서 이어집니다. 개발 중인 제품은 같은 생태계 안에서 다음 단계로 준비됩니다.",
    overviewBadge: "Ecosystem Map",
    overviewTitle: "브랜드는 생태계, 기반은 프로토콜",
    overviewDescription:
      "Koinara는 개별 서비스 모음이 아니라, 프로토콜 위에 제품이 층위별로 연결되는 구조를 지향합니다.",
    resourcesBadge: "Protocol Resources",
    resourcesTitle: "토큰과 네트워크 정보는 리소스로 분리",
    resourcesDescription:
      "Tokenomics와 Trade KOIN은 제품 카드와 섞지 않고 별도 리소스로 보여줘 브랜드와 유틸리티를 구분합니다.",
    toolsBadge: "Core Tools",
    toolsTitle: "프로토콜 기능은 아래 레이어로 정리",
    toolsDescription:
      "Guide, Marketplace, Providers, Dashboard 같은 프로토콜 도구는 여전히 중요하지만, 첫 화면에서는 생태계 브랜드보다 뒤에 배치합니다.",
    buttonInternal: "Open",
    buttonExternal: "Visit",
    buttonSoon: "Coming Soon",
    networkPrefix: "Network",
    state: {
      live: "Live",
      external: "External",
      internal: "Inside Koinara",
      comingSoon: "Coming Soon",
    },
    footerSummary:
      "Koinara Ecosystem is the public brand. Koinara Protocol is the foundation that coordinates market flow, identity, verification, and token-linked participation.",
    footerGroups: {
      ecosystem: "Ecosystem",
      resources: "Resources",
      network: "Networks",
      docs: "Docs",
    },
    footerDocs: {
      github: "GitHub",
      whitepaper: "Whitepaper",
      marketplace: "Marketplace",
      proova: "Proova",
    },
    footerBottom: "KOINARA ECOSYSTEM | WORLDLAND + BASE | PHASE 1 PORTAL",
  },
  en: {
    heroBadge: "KOINARA ECOSYSTEM | PHASE 1",
    title: "Koinara Ecosystem",
    subtitle:
      "Koinara is a protocol-powered ecosystem growing across connected products. The protocol sits underneath the market, identity, verification, and reward surfaces that define the network.",
    support: "Powered by Koinara Protocol",
    primaryCta: "Explore Products",
    secondaryCta: "Open Market",
    tertiaryCta: "View Proova",
    stats: {
      products: "Products",
      networks: "Networks",
      resources: "Protocol Resources",
      tools: "Core Tools",
    },
    productsBadge: "Featured Products",
    productsTitle: "An ecosystem that grows through real products",
    productsDescription:
      "Published products route directly to their external homes, internal products stay inside Koinara, and in-development surfaces stay visible as part of the same network.",
    overviewBadge: "Ecosystem Map",
    overviewTitle: "The brand is the ecosystem. The foundation is the protocol.",
    overviewDescription:
      "Koinara should not read like a loose set of pages. It should read like connected products layered on top of shared infrastructure.",
    resourcesBadge: "Protocol Resources",
    resourcesTitle: "Token and network context live as resources",
    resourcesDescription:
      "Tokenomics and Trade KOIN belong in a clearly separated protocol-resource layer so utility links do not dilute the product brand.",
    toolsBadge: "Core Tools",
    toolsTitle: "Protocol workflows still exist under the brand layer",
    toolsDescription:
      "Guide, Marketplace, Providers, and Dashboard remain available, but the homepage should introduce the ecosystem before the operator console.",
    buttonInternal: "Open",
    buttonExternal: "Visit",
    buttonSoon: "Coming Soon",
    networkPrefix: "Network",
    state: {
      live: "Live",
      external: "External",
      internal: "Inside Koinara",
      comingSoon: "Coming Soon",
    },
    footerSummary:
      "Koinara Ecosystem is the public-facing brand. Koinara Protocol is the foundation that coordinates market flow, identity, verification, and token-linked participation.",
    footerGroups: {
      ecosystem: "Ecosystem",
      resources: "Resources",
      network: "Networks",
      docs: "Docs",
    },
    footerDocs: {
      github: "GitHub",
      whitepaper: "Whitepaper",
      marketplace: "Marketplace",
      proova: "Proova",
    },
    footerBottom: "KOINARA ECOSYSTEM | WORLDLAND + BASE | PHASE 1 PORTAL",
  },
}

const overviewCards = {
  ko: [
    {
      title: "Koinara Protocol",
      description: "생태계의 기반 레이어입니다. 시장, 보상, 네트워크 흐름을 지탱합니다.",
      tag: "Foundation",
    },
    {
      title: "OpenClaw Agent Market",
      description: "Mission Board가 실제로 동작하는 내부 제품입니다. 작업 탐색과 응답 플로우의 중심입니다.",
      tag: "Market Flow",
    },
    {
      title: "Agent ID CARD",
      description: "에이전트 인증과 신뢰 신호를 담당하는 식별 레이어입니다. 미션 참여 관계를 설명해줍니다.",
      tag: "Identity Layer",
    },
    {
      title: "Proova",
      description: "에이전트 결과가 실제로 해결인지 판단하는 검증 레이어입니다.",
      tag: "Verification Layer",
    },
  ],
  en: [
    {
      title: "Koinara Protocol",
      description: "The foundation layer of the ecosystem. It anchors market flow, rewards, and network behavior.",
      tag: "Foundation",
    },
    {
      title: "OpenClaw Agent Market",
      description: "The internal product where the Mission Board currently lives and the market flow actually happens.",
      tag: "Market Flow",
    },
    {
      title: "Agent ID CARD",
      description: "The identity and trust layer for agents. It explains how mission participation and authentication connect.",
      tag: "Identity Layer",
    },
    {
      title: "Proova",
      description: "The verification layer that determines whether agent outputs represent real mission completion.",
      tag: "Verification Layer",
    },
  ],
}

function SectionHeader({ badge, title, description }) {
  return (
    <div className="ecosystem-section-header">
      <span className="ecosystem-section-badge">{badge}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function SurfaceLink({ href, children, className }) {
  if (isExternalHref(href)) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  if (href.startsWith("#")) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  }

  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  )
}

function ProductCard({ item, labels }) {
  const stateTone =
    item.state === "coming-soon"
      ? "amber"
      : item.kind === "external"
        ? "blue"
        : "green"

  return (
    <article className="ecosystem-product-card" id={item.slug === "torqr" ? "torqr" : undefined}>
      <div className="ecosystem-card-top">
        <span className={`ecosystem-pill ecosystem-pill--${stateTone}`}>{labels.state[item.state === "coming-soon" ? "comingSoon" : "live"]}</span>
        <span className="ecosystem-card-meta">{item.kind === "external" ? labels.state.external : labels.state.internal}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="ecosystem-card-bottom">
        <span className="ecosystem-card-relation">{item.relation}</span>
        {item.state === "coming-soon" ? (
          <span className="ecosystem-card-button ecosystem-card-button--disabled">{labels.buttonSoon}</span>
        ) : (
          <SurfaceLink className="ecosystem-card-button" href={item.href}>
            {item.kind === "external" ? labels.buttonExternal : labels.buttonInternal}
          </SurfaceLink>
        )}
      </div>
    </article>
  )
}

function ResourceCard({ item, labels }) {
  return (
    <article className="ecosystem-resource-card">
      <span className={`ecosystem-pill ecosystem-pill--${item.accent}`}>Protocol Resource</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <SurfaceLink className="ecosystem-card-button" href={item.href}>
        {labels.buttonExternal}
      </SurfaceLink>
    </article>
  )
}

function ToolCard({ item, labels }) {
  return (
    <article className="ecosystem-tool-card">
      <span className={`ecosystem-pill ecosystem-pill--${item.accent}`}>Core Tool</span>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <SurfaceLink className="ecosystem-card-button" href={item.href}>
        {labels.buttonInternal}
      </SurfaceLink>
    </article>
  )
}

export default function Landing() {
  const { lang } = useStore()
  const t = copy[lang] ?? copy.en

  const heroStats = [
    { value: String(ECOSYSTEM_PRODUCTS.length), label: t.stats.products },
    { value: String(NETWORK_BADGES.length), label: t.stats.networks },
    { value: String(PROTOCOL_RESOURCES.length), label: t.stats.resources },
    { value: String(CORE_TOOLS.length), label: t.stats.tools },
  ]

  return (
    <div className="ecosystem-page">
      <section className="ecosystem-hero">
        <div className="ecosystem-hero__glow" />
        <div className="ecosystem-shell ecosystem-hero__content">
          <span className="ecosystem-hero__badge">{t.heroBadge}</span>
          <h1>{t.title}</h1>
          <p className="ecosystem-hero__subtitle">{t.subtitle}</p>
          <p className="ecosystem-hero__support">{t.support}</p>

          <div className="ecosystem-network-row">
            {NETWORK_BADGES.map((item) => (
              <div className="ecosystem-network-chip" key={item.key}>
                <span>{item.label}</span>
                <small>{item.value}</small>
              </div>
            ))}
          </div>

          <div className="ecosystem-hero__actions">
            <a className="ecosystem-hero__button ecosystem-hero__button--primary" href="#products">
              {t.primaryCta}
            </a>
            <Link className="ecosystem-hero__button ecosystem-hero__button--secondary" to="/marketplace">
              {t.secondaryCta}
            </Link>
            <Link className="ecosystem-hero__button ecosystem-hero__button--ghost" to="/proova">
              {t.tertiaryCta}
            </Link>
          </div>

          <div className="ecosystem-stat-grid">
            {heroStats.map((item) => (
              <article className="ecosystem-stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ecosystem-section" id="products">
        <div className="ecosystem-shell">
          <SectionHeader
            badge={t.productsBadge}
            description={t.productsDescription}
            title={t.productsTitle}
          />
          <div className="ecosystem-product-grid">
            {ECOSYSTEM_PRODUCTS.map((item) => (
              <ProductCard item={item} key={item.slug} labels={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="ecosystem-section ecosystem-section--overview" id="overview">
        <div className="ecosystem-shell">
          <SectionHeader
            badge={t.overviewBadge}
            description={t.overviewDescription}
            title={t.overviewTitle}
          />
          <div className="ecosystem-overview-grid">
            {overviewCards[lang]?.map((item) => (
              <article className="ecosystem-overview-card" key={item.title}>
                <span className="ecosystem-pill ecosystem-pill--green">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            )) ?? null}
          </div>
        </div>
      </section>

      <section className="ecosystem-section" id="resources">
        <div className="ecosystem-shell">
          <SectionHeader
            badge={t.resourcesBadge}
            description={t.resourcesDescription}
            title={t.resourcesTitle}
          />
          <div className="ecosystem-resource-grid">
            {PROTOCOL_RESOURCES.map((item) => (
              <ResourceCard item={item} key={item.slug} labels={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="ecosystem-section" id="core-tools">
        <div className="ecosystem-shell">
          <SectionHeader
            badge={t.toolsBadge}
            description={t.toolsDescription}
            title={t.toolsTitle}
          />
          <div className="ecosystem-tool-grid">
            {CORE_TOOLS.map((item) => (
              <ToolCard item={item} key={item.slug} labels={t} />
            ))}
          </div>
        </div>
      </section>

      <footer className="ecosystem-footer">
        <div className="ecosystem-shell ecosystem-footer__top">
          <div className="ecosystem-footer__brand">
            <span className="ecosystem-footer__logo">KOINARA</span>
            <p>{t.footerSummary}</p>
          </div>

          <div className="ecosystem-footer__groups">
            <div>
              <strong>{t.footerGroups.ecosystem}</strong>
              {ECOSYSTEM_PRODUCTS.map((item) =>
                item.state === "coming-soon" ? (
                  <span className="ecosystem-footer__item ecosystem-footer__item--disabled" key={item.slug}>
                    {item.title}
                  </span>
                ) : (
                  <SurfaceLink className="ecosystem-footer__item" href={item.href} key={item.slug}>
                    {item.title}
                  </SurfaceLink>
                ),
              )}
            </div>

            <div>
              <strong>{t.footerGroups.resources}</strong>
              {PROTOCOL_RESOURCES.map((item) => (
                <SurfaceLink className="ecosystem-footer__item" href={item.href} key={item.slug}>
                  {item.title}
                </SurfaceLink>
              ))}
            </div>

            <div>
              <strong>{t.footerGroups.network}</strong>
              {NETWORK_BADGES.map((item) => (
                <div className="ecosystem-footer__item ecosystem-footer__item--plain" key={item.key}>
                  <span>{item.label}</span>
                  <small>{item.value}</small>
                </div>
              ))}
            </div>

            <div>
              <strong>{t.footerGroups.docs}</strong>
              <a className="ecosystem-footer__item" href={REPO_URL} rel="noreferrer" target="_blank">
                {t.footerDocs.github}
              </a>
              <a className="ecosystem-footer__item" href={`${REPO_URL}/blob/main/docs/whitepaper.md`} rel="noreferrer" target="_blank">
                {t.footerDocs.whitepaper}
              </a>
              <Link className="ecosystem-footer__item" to="/marketplace">
                {t.footerDocs.marketplace}
              </Link>
              <Link className="ecosystem-footer__item" to="/proova">
                {t.footerDocs.proova}
              </Link>
            </div>
          </div>
        </div>

        <div className="ecosystem-shell ecosystem-footer__bottom">
          <span>{t.footerBottom}</span>
          <div>
            <span>WORLDLAND</span>
            <span>BASE</span>
            <span>KOINARA PROTOCOL</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
