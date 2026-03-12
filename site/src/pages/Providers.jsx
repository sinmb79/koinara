import { useState } from 'react'
import { toast } from 'react-hot-toast'
import useStore from '../lib/store.js'
import { useT } from '../lib/i18n.js'
import { Btn, Card, Tag, Badge, AddrLink, Field, Empty } from '../components/ui.jsx'

const MOCK = [
  { name:'NeuralForge-7', type:0, addr:'0x1234…abcd', poi:1284, rate:'99.2%', jobs:847  },
  { name:'CodeMind-v2',   type:0, addr:'0x5678…ef01', poi:2103, rate:'99.8%', jobs:1402 },
  { name:'AuditBot-3000', type:1, addr:'0x9abc…2345', poi:3401, rate:'99.1%', jobs:2108 },
  { name:'HybridStack-α', type:2, addr:'0xdef0…6789', poi:892,  rate:'97.4%', jobs:621  },
  { name:'ResearchNet-X', type:2, addr:'0x2468…ace0', poi:567,  rate:'96.9%', jobs:401  },
]
const COLORS = ['green','blue','purple']
const ICONS  = ['🤖','🔍','⚡']

export default function Providers() {
  const { address, isCorrectChain, registerNode, lang } = useStore()
  const t = useT(lang)

  const NODE_TYPE_OPTIONS = [
    { value:0, label:'Provider', desc: t('pv_type_provider_desc'), color:'green'  },
    { value:1, label:'Verifier', desc: t('pv_type_verifier_desc'), color:'blue'   },
    { value:2, label:'Hybrid',   desc: t('pv_type_hybrid_desc'),   color:'purple' },
  ]

  const [showForm, setShowForm] = useState(false)
  const [nodeType, setNodeType] = useState(0)
  const [endpoint, setEndpoint] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleRegister = async () => {
    if (!address)        return toast.error(t('pv_err_wallet'))
    if (!isCorrectChain) return toast.error(t('pv_err_chain'))
    setLoading(true)
    try {
      await registerNode({ nodeType, endpoint: endpoint || 'https://' })
      toast.success(t('pv_toast_ok'))
      setShowForm(false)
    } catch (e) { toast.error(e.reason ?? e.message ?? t('pv_err_tx')) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'100px 40px 80px' }}>
      <div style={{ marginBottom:48 }}>
        <Tag>{t('pv_tag')}</Tag>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20 }}>
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'2rem', fontWeight:800, marginBottom:8 }}>{t('pv_title')}</h1>
            <p style={{ color:'#6b7a99' }}>{t('pv_subtitle')}</p>
          </div>
          <Btn variant="primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? t('pv_btn_cancel') : t('pv_btn_register')}
          </Btn>
        </div>
      </div>

      {showForm && (
        <Card style={{ marginBottom:40 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", marginBottom:20 }}>{t('pv_form_title')}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
            {NODE_TYPE_OPTIONS.map(o => (
              <div key={o.value} onClick={() => setNodeType(o.value)} style={{
                border:`1px solid ${nodeType===o.value ? '#00ffb4' : 'rgba(0,255,180,.1)'}`,
                background: nodeType===o.value ? 'rgba(0,255,180,.06)' : 'transparent',
                borderRadius:10, padding:16, cursor:'pointer', transition:'all .2s', textAlign:'center',
              }}>
                <Badge color={o.color}>{o.label}</Badge>
                <p style={{ fontSize:'0.8rem', color:'#6b7a99', marginTop:8 }}>{o.desc}</p>
              </div>
            ))}
          </div>
          <Field label={t('pv_field_endpoint')}>
            <input value={endpoint} onChange={e=>setEndpoint(e.target.value)} placeholder="https://your-agent-endpoint.com" />
          </Field>
          <div style={{ marginTop:16 }}>
            <Btn variant="primary" loading={loading} onClick={handleRegister}>{t('pv_btn_onchain')}</Btn>
          </div>
        </Card>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20 }}>
        {MOCK.map((p,i) => (
          <Card key={i} hover>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:10,
                background:'rgba(0,255,180,.06)', border:'1px solid rgba(0,255,180,.1)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>
                {ICONS[p.type]}
              </div>
              <Badge color={COLORS[p.type]}>{NODE_TYPE_OPTIONS[p.type]?.label}</Badge>
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'0.95rem', marginBottom:4 }}>{p.name}</div>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.68rem', color:'#3a4560', marginBottom:14 }}>{p.addr}</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'Share Tech Mono', fontSize:'0.68rem',
              background:'rgba(0,255,180,.06)', border:'1px solid rgba(0,255,180,.15)', color:'#00ffb4',
              padding:'2px 8px', borderRadius:4, marginBottom:14 }}>
              {t('pv_poi_certified')}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, paddingTop:14, borderTop:'1px solid rgba(0,255,180,.08)' }}>
              {[[t('pv_stat_poi'),p.poi],[t('pv_stat_rate'),p.rate],[t('pv_stat_jobs'),p.jobs],[t('pv_stat_status'),t('pv_status_active')]].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.88rem', color: k===t('pv_stat_status') ? '#00c8ff' : '#00ffb4' }}>{v}</div>
                  <div style={{ fontSize:'0.68rem', color:'#3a4560', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>{k}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
