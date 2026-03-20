import { useEffect } from "react"

const TARGET_URL = "https://koinara.xyz/missions"

export default function Marketplace() {
  useEffect(() => {
    window.location.href = TARGET_URL
  }, [])

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
        color: "#8893aa",
      }}
    >
      <div>
        <p style={{ margin: 0, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Redirecting to OpenClaw Agent Marketplace...
        </p>
        <a
          href={TARGET_URL}
          rel="noreferrer"
          style={{ color: "#00ffb4", display: "inline-block", marginTop: 16 }}
          target="_blank"
        >
          Open marketplace
        </a>
      </div>
    </div>
  )
}
