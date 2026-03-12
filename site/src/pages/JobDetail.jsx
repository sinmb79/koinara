import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow, fromUnixTime, format } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import useStore from '../lib/store.js'
import { useT } from '../lib/i18n.js'
import { usePolling } from '../hooks/usePolling.js'
import { Btn, Card, Divider, JobTypeBadge, JobStateBadge, PulseDot, Spinner, TxLink, AddrLink } from '../components/ui.jsx'
import { JOB_TYPE_WEIGHT, JOB_TYPE_QUORUM } from '../abi/index.js'

export default function JobDetail() {
  const { id } = useParams()
  const jobId  = Number(id)
  const { jobs, loadJobs, submitResponse, claimReward, getPOI, getResponses, address, isCorrectChain, lang } = useStore()
  const t      = useT(lang)
  const locale = lang === 'ko' ? ko : enUS

  const [job, setJob]           = useState(null)
  const [responses, setResponses] = useState([])
  const [poi, setPoi]           = useState(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [claiming, setClaiming]     = useState(false)
  const [lastTx, setLastTx]         = useState(null)

  useEffect(() => { const found = jobs.find(j => j.id === jobId); if (found) setJob(found) }, [jobs, jobId])
  useEffect(() => { if (!job) loadJobs() }, [])

  const fetchDetails = async () => {
    const [resps, poiData] = await Promise.all([getResponses(jobId), getPOI(jobId)])
    setResponses(resps)
    if (poiData) setPoi(poiData)
  }
  usePolling(fetchDetails, 8000, !!jobId)

  const handleSubmitResponse = async () => {
    if (!address)        return toast.error(t('jd_err_wallet'))
    if (!isCorrectChain) return toast.error(t('jd_err_chain'))
    if (!responseText.trim()) return toast.error(t('jd_err_empty'))
    setSubmitting(true)
    try {
      const { receipt } = await submitResponse({ jobId, responseText })
      setLastTx(receipt.hash)
      toast.success(t('jd_toast_ok'))
      setResponseText('')
      fetchDetails()
    } catch (e) { toast.error(e.reason ?? e.message ?? t('jd_err_tx')) }
    finally { setSubmitting(false) }
  }

  const handleClaim = async () => {
    if (!address) return toast.error(t('jd_err_wallet'))
    setClaiming(true)
    try {
      const { receipt } = await claimReward(jobId)
      setLastTx(receipt.hash)
      toast.success(t('jd_claim_ok'))
    } catch (e) { toast.error(e.reason ?? e.message ?? t('jd_err_claim')) }
    finally { setClaiming(false) }
  }

  if (!job) return <div style={{ display:'flex', justifyContent:'center', padding:'160px 0' }}><Spinner size={32} /></div>

  const dl      = fromUnixTime(job.deadline)
  const isPastDl = dl < new Date()
  const weight  = JOB_TYPE_WEIGHT[job.jobType] ?? 1
  const quorum  = JOB_TYPE_QUORUM[job.jobType] ?? 1
  const premium = job.premiumReward ? ethers.formatEther(job.premiumReward) : '0'
  const myResponse = responses.find(r => r.provider?.toLowerCase() === address?.toLowerCase())

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'100px 40px 80px' }}>
      <Link to="/marketplace" style={{ fontFamily:'Share Tech Mono', fontSize:'0.78rem', color:'#6b7a99', display:'inline-flex', alignItems:'center', gap:6, marginBottom:28 }}>
        {t('jd_back')}
      </Link>
      <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' }}>
        <JobTypeBadge type={job.jobType} />
        <JobStateBadge state={job.state} />
        {poi?.exists && (
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'Share Tech Mono', fontSize:'0.68rem',
            background:'rgba(0,255,180,.06)', border:'1px solid rgba(0,255,180,.2)', color:'#00ffb4', padding:'2px 8px', borderRadius:4 }}>
            {t('jd_poi_issued')}
          </span>
        )}
      </div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.7rem', fontWeight:800, marginBottom:16, lineHeight:1.25 }}>{job.title}</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:32, alignItems:'start' }}>
        <div>
          {job.request && (
            <Card style={{ marginBottom:24 }}>
              <p style={{ fontSize:'0.9rem', color:'#6b7a99', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{job.request}</p>
            </Card>
          )}
          {job.state === 0 && !isPastDl && (
            <Card>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1rem', marginBottom:16 }}>{t('jd_response_title')}</h3>
              {myResponse ? (
                <div style={{ padding:'12px 16px', background:'rgba(0,255,180,.04)', borderRadius:8, border:'1px solid rgba(0,255,180,.15)' }}>
                  <p style={{ fontFamily:'Share Tech Mono', fontSize:'0.8rem', color:'#00ffb4', marginBottom:4 }}>{t('jd_response_done')}</p>
                  <p style={{ fontSize:'0.8rem', color:'#6b7a99' }}>{t('jd_response_done_desc')}</p>
                </div>
              ) : (
                <>
                  <textarea rows={6} value={responseText} onChange={e=>setResponseText(e.target.value)}
                    placeholder={t('jd_response_ph')} style={{ marginBottom:12 }} />
                  <Btn variant="primary" full loading={submitting} onClick={handleSubmitResponse} disabled={!address||submitting}>
                    {t('jd_response_btn')}
                  </Btn>
                  {lastTx && <TxLink hash={lastTx} />}
                </>
              )}
            </Card>
          )}
          {responses.length > 0 && (
            <div style={{ marginTop:24 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1rem', marginBottom:16 }}>
                {t('jd_responses_list', responses.length)}
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {responses.map((r,i) => (
                  <Card key={i}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <AddrLink addr={r.provider} />
                      <span style={{ fontFamily:'Share Tech Mono', fontSize:'0.7rem', color: r.accepted ? '#00ffb4' : '#6b7a99' }}>
                        {r.accepted ? t('jd_accepted') : `✓ ${r.approvalCount}/${quorum}`}
                      </span>
                    </div>
                    {r.text && (
                      <p style={{ fontSize:'0.84rem', color:'#6b7a99', lineHeight:1.55, marginTop:8, whiteSpace:'pre-wrap',
                        display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{r.text}</p>
                    )}
                    <Divider style={{ marginTop:10 }} />
                    <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.68rem', color:'#3a4560', marginTop:8 }}>
                      hash: {r.responseHash?.slice(0,20)}…
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Card>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#00ffb4', marginBottom:16, letterSpacing:'0.1em' }}>// JOB INFO</div>
            {[
              [t('jd_job_id'),    `#${job.id}`],
              [t('jd_type'),      ['Simple','General','Collective'][job.jobType] ?? '-'],
              [t('jd_weight'),    `×${weight} KOIN`],
              [t('jd_quorum'),    t('jd_quorum_unit', quorum)],
              [t('jd_premium'),   Number(premium) > 0 ? `${premium} WLC` : t('jd_premium_none')],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(0,255,180,.06)' }}>
                <span style={{ fontSize:'0.78rem', color:'#3a4560', textTransform:'uppercase', letterSpacing:'0.05em' }}>{k}</span>
                <span style={{ fontFamily:'Share Tech Mono', fontSize:'0.82rem', color:'#e8f0ff' }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0' }}>
              <span style={{ fontSize:'0.78rem', color:'#3a4560', textTransform:'uppercase', letterSpacing:'0.05em' }}>{t('jd_deadline')}</span>
              <span style={{ fontFamily:'Share Tech Mono', fontSize:'0.78rem', color: isPastDl ? '#ff4466' : '#ffaa00' }}>
                {isPastDl ? t('jd_expired') : formatDistanceToNow(dl, { addSuffix:true, locale })}
              </span>
            </div>
            <div style={{ marginTop:4 }}><AddrLink addr={job.requester} /></div>
          </Card>

          {poi?.exists && (
            <Card>
              <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#00ffb4', marginBottom:12, letterSpacing:'0.1em' }}>
                {t('jd_section_poi')}
              </div>
              <div style={{ fontSize:'0.78rem', color:'#6b7a99', marginBottom:8 }}>{t('jd_poi_provider')}</div>
              <AddrLink addr={poi.provider} />
              <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.68rem', color:'#3a4560', marginTop:10, wordBreak:'break-all' }}>
                hash: {poi.poiHash?.slice(0,24)}…
              </div>
              {poi.acceptedAt > 0 && (
                <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.68rem', color:'#3a4560', marginTop:4 }}>
                  {format(fromUnixTime(poi.acceptedAt), 'yyyy-MM-dd HH:mm')}
                </div>
              )}
            </Card>
          )}

          {poi?.exists && poi.provider?.toLowerCase() === address?.toLowerCase() && (
            <Card>
              <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#00ffb4', marginBottom:12 }}>
                {t('jd_section_claim')}
              </div>
              <p style={{ fontSize:'0.84rem', color:'#6b7a99', marginBottom:16 }}>{t('jd_claim_desc')}</p>
              <Btn variant="primary" full loading={claiming} onClick={handleClaim}>{t('jd_btn_claim')}</Btn>
              {lastTx && <TxLink hash={lastTx} />}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
