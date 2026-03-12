import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import useStore from './lib/store.js'
import Dashboard from './pages/Dashboard.jsx'
import DApps from './pages/DApps.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Landing from './pages/Landing.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Providers from './pages/Providers.jsx'
import SubmitJob from './pages/SubmitJob.jsx'

export default function App() {
  const location = useLocation()
  const { initReadOnly, loadJobs } = useStore()
  const isLanding = location.pathname === '/'

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
        </Routes>
      </main>

      {!isLanding ? (
        <footer
          style={{
            borderTop: '1px solid rgba(0,255,180,.08)',
            padding: '28px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            background: 'rgba(5,8,16,0.6)',
          }}
        >
          <span style={{ fontFamily: 'Share Tech Mono', fontSize: '0.7rem', color: '#3a4560' }}>
            © 2025 KOINARA PROTOCOL · WORLDLAND MAINNET (CHAIN 103)
          </span>
          <div
            style={{
              display: 'flex',
              gap: 20,
              fontFamily: 'Share Tech Mono',
              fontSize: '0.68rem',
              color: '#3a4560',
            }}
          >
            <span>NO_PREMINE</span>
            <span>FAIR_LAUNCH</span>
            <span>CHAIN_INDEPENDENT</span>
          </div>
        </footer>
      ) : null}
    </>
  )
}
