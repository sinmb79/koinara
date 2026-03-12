import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Marketplace from './pages/Marketplace.jsx'
import SubmitJob from './pages/SubmitJob.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Providers from './pages/Providers.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DApps from './pages/DApps.jsx'
import useStore from './lib/store.js'

export default function App() {
  const { initReadOnly, loadJobs } = useStore()

  useEffect(() => {
    initReadOnly()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => loadJobs(), 800)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/submit" element={<SubmitJob />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dapps" element={<DApps />} />
        </Routes>
      </main>

      <footer
        style={{
          borderTop: '1px solid rgba(0,255,180,.08)',
          padding: '28px clamp(20px, 5vw, 40px)',
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
        <div style={{ display: 'flex', gap: 20, fontFamily: 'Share Tech Mono', fontSize: '0.68rem', color: '#3a4560' }}>
          <span>NO_PREMINE</span>
          <span>FAIR_LAUNCH</span>
          <span>CHAIN_INDEPENDENT</span>
        </div>
      </footer>
    </>
  )
}
