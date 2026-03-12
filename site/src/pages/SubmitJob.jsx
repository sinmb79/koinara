import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useStore from '../lib/store.js'
import { useT } from '../lib/i18n.js'
import { Btn, Tag, Field, TxLink } from '../components/ui.jsx'

const initialForm = {
  title: '',
  request: '',
  schema: '',
  jobType: 'general',
  deadlineHours: '24',
  premiumEth: '0',
}

export default function SubmitJob() {
  const navigate = useNavigate()
  const { address, submitJob, isCorrectChain, lang } = useStore()
  const t = useT(lang)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const typeOptions = [
    { key:'simple', label:'SIMPLE', weight:'x1', quorum:'Quorum 1', desc:t('sj_type_simple_desc') },
    { key:'general', label:'GENERAL', weight:'x3', quorum:'Quorum 3', desc:t('sj_type_general_desc') },
    { key:'collective', label:'COLLECTIVE', weight:'x7', quorum:'Quorum 5', desc:t('sj_type_collective_desc') },
  ]

  const handleSubmit = async () => {
    if (!address) return toast.error(t('sj_err_wallet'))
    if (!isCorrectChain) return toast.error(t('sj_err_chain'))
    if (!form.title) return toast.error(t('sj_err_title'))
    if (!form.request) return toast.error(t('sj_err_request'))

    setLoading(true)
    try {
      const { receipt, jobId } = await submitJob(form)
      setResult({ txHash: receipt.hash, jobId })
      toast.success(t('sj_toast_ok', jobId))
    } catch (error) {
      toast.error(error.reason ?? error.message ?? t('sj_err_tx'))
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div style={{ maxWidth:600, margin:'0 auto', padding:'120px clamp(20px, 5vw, 40px) 80px' }}>
        <div style={{ background:'#0c1220', border:'1px solid rgba(0,255,180,.3)', borderRadius:16, padding:40, textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:20 }}>OK</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.5rem', marginBottom:8 }}>{t('sj_success_title')}</h2>
          <p style={{ color:'#6b7a99', marginBottom:24 }}>{t('sj_success_desc', result.jobId)}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:32 }}>
            <TxLink hash={result.txHash} />
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Btn variant="primary" onClick={() => navigate(`/job/${result.jobId}`)}>{t('sj_success_view')}</Btn>
            <Btn variant="ghost" onClick={() => { setResult(null); setForm(initialForm) }}>{t('sj_success_new')}</Btn>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth:780, margin:'0 auto', padding:'100px clamp(20px, 5vw, 40px) 80px' }}>
      <Tag>{t('sj_tag')}</Tag>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'2rem', fontWeight:800, marginBottom:8 }}>{t('sj_title')}</h1>
      <p style={{ color:'#6b7a99', marginBottom:40, lineHeight:1.65 }}>{t('sj_subtitle')}</p>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <Field label={t('sj_field_title')}>
          <input value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder={t('sj_field_title_ph')} />
        </Field>

        <Field label={t('sj_field_request')} hint={t('sj_field_request_hint')}>
          <textarea rows={5} value={form.request} onChange={(event) => setField('request', event.target.value)} placeholder={t('sj_field_request_ph')} />
        </Field>

        <Field label={t('sj_field_type')}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10 }}>
            {typeOptions.map((option) => (
              <div
                key={option.key}
                onClick={() => setField('jobType', option.key)}
                style={{
                  border:`1px solid ${form.jobType === option.key ? '#00ffb4' : 'rgba(0,255,180,.1)'}`,
                  background: form.jobType === option.key ? 'rgba(0,255,180,.06)' : 'transparent',
                  borderRadius:10,
                  padding:'14px 12px',
                  cursor:'pointer',
                  transition:'all .2s',
                }}
              >
                <span style={{ fontFamily:'Share Tech Mono', fontSize:'0.78rem', color:'#00ffb4', display:'block', marginBottom:2 }}>{option.label}</span>
                <span style={{ fontFamily:'Share Tech Mono', fontSize:'0.7rem', color:'#00c8ff', display:'block', marginBottom:6 }}>{option.weight} · {option.quorum}</span>
                <span style={{ fontSize:'0.75rem', color:'#6b7a99' }}>{option.desc}</span>
              </div>
            ))}
          </div>
        </Field>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
          <Field label={t('sj_field_deadline')}>
            <input type="number" value={form.deadlineHours} onChange={(event) => setField('deadlineHours', event.target.value)} min="1" max="720" />
          </Field>
          <Field label={t('sj_field_premium')} hint={t('sj_field_premium_hint')}>
            <input type="number" value={form.premiumEth} onChange={(event) => setField('premiumEth', event.target.value)} min="0" step="0.001" />
          </Field>
        </div>

        <Field label={t('sj_field_schema')} hint={t('sj_field_schema_hint')}>
          <input value={form.schema} onChange={(event) => setField('schema', event.target.value)} placeholder="free-form" />
        </Field>

        <div style={{ marginTop:8 }}>
          <Btn variant="primary" size="lg" full loading={loading} onClick={handleSubmit} disabled={!address || loading}>
            {address ? t('sj_btn_submit') : t('sj_btn_no_wallet')}
          </Btn>
          {!isCorrectChain && address && (
            <p style={{ marginTop:8, fontSize:'0.8rem', color:'#ff4466', textAlign:'center' }}>{t('sj_chain_warning')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
