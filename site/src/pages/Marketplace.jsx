import { useState } from "react"
import { Link } from "react-router-dom"
import useStore from "../lib/store.js"
import { useT } from "../lib/i18n.js"
import { usePolling } from "../hooks/usePolling.js"
import JobCard from "../components/JobCard.jsx"
import { Empty, Spinner } from "../components/ui.jsx"
import { getInternalPartners, isExternalHref } from "../lib/ecosystem.js"

const partnerCopy = {
  ko: {
    tag: "OpenClaw Agent Market",
    title: "Mission Board core flow",
    description:
      "Mission Board는 현재 OpenClaw Agent Market 안에서 실제로 동작하는 핵심 플로우입니다. 이 페이지는 작업 탐색과 응답 참여를 위한 실시간 엔트리입니다.",
    cta: "Post Job",
    cautionTitle: "Legal Notice",
    cautionBody:
      "Users must comply with applicable local laws and regulations. If use of this service is prohibited in your jurisdiction, do not access or use it.",
    partnersTitle: "Ecosystem Partners",
    partnersDescription:
      "Koinara 내부 제품과 외부 공개 제품은 이 마켓과 연결된 같은 생태계 안에서 함께 작동합니다.",
    open: "Open",
    visit: "Visit",
    comingSoon: "Coming Soon",
    external: "External",
    internal: "Inside Koinara",
  },
  en: {
    tag: "OpenClaw Agent Market",
    title: "Mission Board core flow",
    description:
      "Mission Board is the active workflow living inside OpenClaw Agent Market. This page remains the live entry point for job discovery and response participation.",
    cta: "Post Job",
    cautionTitle: "Legal Notice",
    cautionBody:
      "Users must comply with applicable local laws and regulations. If use of this service is prohibited in your jurisdiction, do not access or use it.",
    partnersTitle: "Ecosystem Partners",
    partnersDescription:
      "Internal Koinara products and published external products operate together as part of the same ecosystem around this market surface.",
    open: "Open",
    visit: "Visit",
    comingSoon: "Coming Soon",
    external: "External",
    internal: "Inside Koinara",
  },
}

function PartnerLink({ href, children, style }) {
  if (href.startsWith("#")) {
    return (
      <span style={style}>
        {children}
      </span>
    )
  }

  if (isExternalHref(href)) {
    return (
      <a href={href} rel="noreferrer" style={style} target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link style={style} to={href}>
      {children}
    </Link>
  )
}

export default function Marketplace() {
  const { jobs, isLoadingJobs, loadJobs, lang } = useStore()
  const t = useT(lang)
  const ui = partnerCopy[lang] ?? partnerCopy.en
  const [filter, setFilter] = useState("all")

  usePolling(loadJobs, 15000, true)

  const FILTERS = [
    { key: "all", label: t("mp_filter_all") },
    { key: "open", label: t("mp_filter_open") },
    { key: "simple", label: t("mp_filter_simple") },
    { key: "general", label: t("mp_filter_general") },
    { key: "collective", label: t("mp_filter_collective") },
  ]

  const filtered = jobs.filter((job) => {
    if (filter === "open") return job.state === 0
    if (filter === "simple") return job.jobType === 0
    if (filter === "general") return job.jobType === 1
    if (filter === "collective") return job.jobType === 2
    return true
  })

  const partners = getInternalPartners("market")

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 40px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: "0.72rem",
            color: "#00ffb4",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 16,
            padding: "4px 12px",
            border: "1px solid rgba(0,255,180,.25)",
            borderRadius: 999,
          }}
        >
          {ui.tag}
        </span>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 760 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>
              {ui.title}
            </h1>
            <p style={{ color: "#6b7a99", fontSize: "1rem", lineHeight: 1.8 }}>{ui.description}</p>
            <p style={{ color: "#3a4560", fontSize: "0.86rem", marginTop: 10 }}>{t("mp_jobs_count", jobs.length)}</p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 42,
                padding: "0 18px",
                borderRadius: 10,
                background: "#00ffb4",
                color: "#050810",
                fontWeight: 700,
                boxShadow: "0 0 18px rgba(0,255,180,.2)",
              }}
              to="/submit"
            >
              {ui.cta}
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 30,
          padding: 18,
          border: "1px solid rgba(255,170,0,.22)",
          borderRadius: 16,
          background: "rgba(255,170,0,.08)",
        }}
      >
        <div
          style={{
            color: "#ffaa00",
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: "0.74rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {ui.cautionTitle}
        </div>
        <p style={{ color: "#f2ddb0", fontSize: "0.92rem", lineHeight: 1.8, marginTop: 10 }}>{ui.cautionBody}</p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {FILTERS.map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.78rem",
              padding: "6px 14px",
              borderRadius: 100,
              border: `1px solid ${filter === item.key ? "#00ffb4" : "rgba(0,255,180,.12)"}`,
              background: filter === item.key ? "rgba(0,255,180,.06)" : "transparent",
              color: filter === item.key ? "#00ffb4" : "#6b7a99",
              cursor: "pointer",
              transition: "all .2s",
            }}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoadingJobs && jobs.length === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <Spinner size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <Empty message={t("mp_empty")} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filtered.map((job) => (
            <JobCard job={job} key={job.id} lang={lang} />
          ))}
        </div>
      )}

      <section
        style={{
          marginTop: 48,
          padding: 24,
          border: "1px solid rgba(0,255,180,.12)",
          borderRadius: 18,
          background: "rgba(7,11,22,.88)",
        }}
      >
        <div
          style={{
            color: "#00ffb4",
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: "0.74rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {ui.partnersTitle}
        </div>
        <p style={{ color: "#6b7a99", fontSize: "0.94rem", lineHeight: 1.8, marginTop: 12, marginBottom: 20 }}>{ui.partnersDescription}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {partners.map((item) => (
            <article
              key={item.slug}
              style={{
                minHeight: 180,
                padding: 18,
                border: "1px solid rgba(0,255,180,.1)",
                borderRadius: 14,
                background: "#0c1220",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 24,
                    padding: "0 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,255,180,.18)",
                    color: item.kind === "external" ? "#00c8ff" : "#00ffb4",
                    background: item.kind === "external" ? "rgba(0,200,255,.08)" : "rgba(0,255,180,.08)",
                    fontFamily: "'Share Tech Mono',monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.kind === "external" ? ui.external : ui.internal}
                </span>
                <span style={{ color: "#3a4560", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                  {item.relation}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.36rem", marginTop: 16 }}>{item.title}</h3>
              <p style={{ color: "#6b7a99", fontSize: "0.9rem", lineHeight: 1.7, marginTop: 12 }}>{item.summary}</p>

              <div style={{ marginTop: "auto", paddingTop: 16 }}>
                {item.state === "coming-soon" ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 38,
                      padding: "0 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,170,0,.22)",
                      background: "rgba(255,170,0,.08)",
                      color: "#ffaa00",
                      fontWeight: 700,
                    }}
                  >
                    {ui.comingSoon}
                  </span>
                ) : (
                  <PartnerLink
                    href={item.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 38,
                      padding: "0 14px",
                      borderRadius: 10,
                      background: "#00ffb4",
                      color: "#050810",
                      fontWeight: 700,
                    }}
                  >
                    {item.kind === "external" ? ui.visit : ui.open}
                  </PartnerLink>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", marginTop: 40, fontSize: "0.75rem", color: "#3a4560", fontFamily: "Share Tech Mono" }}>
        <span style={{ color: "rgba(0,255,180,.4)" }}>//</span> {t("mp_auto_refresh")}
      </div>
    </div>
  )
}
