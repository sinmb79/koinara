import { useEffect } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import useStore from "./lib/store.js"
import { NETWORK_BADGES, PROTOCOL_RESOURCES, isExternalHref } from "./lib/ecosystem.js"
import Dashboard from "./pages/Dashboard.jsx"
import DApps from "./pages/DApps.jsx"
import JobDetail from "./pages/JobDetail.jsx"
import Landing from "./pages/Landing.jsx"
import Marketplace from "./pages/Marketplace.jsx"
import Proova from "./pages/Proova.jsx"
import Providers from "./pages/Providers.jsx"
import SubmitJob from "./pages/SubmitJob.jsx"

function FooterLink({ href, children }) {
  if (isExternalHref(href)) {
    return (
      <a href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  return <Link to={href}>{children}</Link>
}

export default function App() {
  const location = useLocation()
  const { initReadOnly, loadJobs } = useStore()
  const isLanding = location.pathname === "/"

  useEffect(() => {
    if (isLanding) return undefined
    initReadOnly()
    return undefined
  }, [initReadOnly, isLanding])

  useEffect(() => {
    if (isLanding) return undefined
    const timer = setTimeout(() => loadJobs(), 800)
    return () => clearTimeout(timer)
  }, [isLanding, loadJobs])

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/submit" element={<SubmitJob />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dapps" element={<DApps />} />
          <Route path="/proova" element={<Proova />} />
        </Routes>
      </main>

      {!isLanding ? (
        <footer
          style={{
            borderTop: "1px solid rgba(0,255,180,.08)",
            padding: "28px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            background: "rgba(5,8,16,0.72)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              color: "#3a4560",
              fontFamily: "Share Tech Mono",
              fontSize: "0.68rem",
            }}
          >
            {NETWORK_BADGES.map((item) => (
              <span key={item.key}>
                {item.label.toUpperCase()} | {item.value.toUpperCase()}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              fontFamily: "Share Tech Mono",
              fontSize: "0.68rem",
              color: "#3a4560",
              flexWrap: "wrap",
            }}
          >
            <Link style={{ color: "#00ffb4" }} to="/proova">
              PROOVA
            </Link>
            <Link style={{ color: "#00ffb4" }} to="/marketplace">
              MARKET
            </Link>
            {PROTOCOL_RESOURCES.map((item) => (
              <FooterLink href={item.href} key={item.slug}>
                <span style={{ color: "#00ffb4" }}>{item.title.toUpperCase()}</span>
              </FooterLink>
            ))}
          </div>
        </footer>
      ) : null}
    </>
  )
}
