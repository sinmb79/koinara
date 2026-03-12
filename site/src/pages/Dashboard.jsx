import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useStore from '../lib/store.js'
import { useT } from '../lib/i18n.js'
import { usePolling } from '../hooks/usePolling.js'
import { Btn, Card, Tag, JobTypeBadge, JobStateBadge, AddrLink, Empty } from '../components/ui.jsx'
import { ADDRESSES } from '../abi/index.js'
import { addrUrl } from '../lib/chain.js'

export default function Dashboard() {
  const { address, wlcBalance, koinBalance, pendingReward, jobs,
          refreshBalances, loadJobs, claimReward, isCorrectChain, lang } = useStore()
  const t = useT(lang)

  usePolling(refreshBalances, 12000, !!address)
  usePolling(loadJobs, 20000, !!address)

  const myJobs = jobs.filter(j => j.requester?.toLowerCase() === address?.toLowerCase())
  const [claiming, setClaiming] = useState(null)

  const handleClaim = async (jobId) => {
    if (!isCorrectChain) return toast.error(t('db_err_chain'))
    setClaiming(jobId)
    try { await claimReward(jobId); toast.success(t('db_toast_claim')) }
    catch (e) { toast.error(e.reason ?? e.message ?? t('db_err_claim')) }
    finally { setClaiming(null) }
  }

  if (!address) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:16 }}>
      <span style={{ fontFamily:'Share Tech Mono', fontSize:'1.5rem', color:'#3a4560' }}>∅</span>
      <p style={{ color:'#6b7a99' }}>{t('db_no_wallet')}</p>
    </div>
  )

  return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'100px 40px 80px' }}>
      <Tag>{t('db_tag')}</Tag>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'2rem', fontWeight:800, marginBottom:8 }}>{t('db_title')}</h1>
      <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.8rem', color:'#6b7a99', marginBottom:40 }}>
        <AddrLink addr={address} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:40 }}>
        {[
          { label: t('db_bal_wlc'),     value: Number(wlcBalance).toFixed(4),   unit:'WLC',  color:'#00c8ff' },
          { label: t('db_bal_koin'),    value: Number(koinBalance).toFixed(2),  unit:'KOIN', color:'#00ffb4' },
          { label: t('db_bal_pending'), value: Number(pendingReward).toFixed(2), unit:'KOIN', color:'#ffaa00' },
        ].map(b => (
          <Card key={b.label}>
            <div style={{ fontSize:'0.72rem', color:'#3a4560', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{b.label}</div>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:'1.5rem', color:b.color, marginBottom:2 }}>{b.value}</div>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#6b7a99' }}>{b.unit}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom:40 }}>
        <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#00ffb4', marginBottom:16, letterSpacing:'0.1em' }}>
          {t('db_contracts')}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            ['InferenceJobRegistry', ADDRESSES.registry],
            ['PoI Verifier',         ADDRESSES.verifier],
            ['NodeRegistry',         ADDRESSES.nodeReg],
            ['RewardDistributor',    ADDRESSES.distributor],
            ['KOINToken',            ADDRESSES.koin],
          ].map(([name, addr]) => (
            <div key={name} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'#080d18', borderRadius:8, gap:12 }}>
              <span style={{ fontSize:'0.78rem', color:'#6b7a99' }}>{name}</span>
              <a href={addrUrl(addr)} target="_blank" rel="noreferrer"
                style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#00ffb4', textDecoration:'none' }}>
                {addr.slice(0,8)}…{addr.slice(-4)} ↗
              </a>
            </div>
          ))}
        </div>
      </Card>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.2rem', marginBottom:16 }}>{t('db_my_jobs')}</h2>
      {myJobs.length === 0 ? (
        <div style={{ marginBottom:40 }}>
          <Empty message={t('db_no_jobs')} />
          <div style={{ textAlign:'center', marginTop:16 }}>
            <Link to="/submit"><Btn variant="outline">{t('db_btn_new_job')}</Btn></Link>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
          {myJobs.map(job => (
            <Card key={job.id} style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                  <JobTypeBadge type={job.jobType} />
                  <JobStateBadge state={job.state} />
                </div>
                <Link to={`/job/${job.id}`} style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, color:'#e8f0ff', textDecoration:'none', fontSize:'0.95rem' }}>
                  {job.title}
                </Link>
              </div>
              <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#3a4560' }}>#{job.id}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
