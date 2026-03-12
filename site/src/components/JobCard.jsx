import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { formatDistanceToNow, fromUnixTime, isPast } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { Card, Divider, JobStateBadge, JobTypeBadge, PulseDot } from './ui.jsx'
import { useT } from '../lib/i18n.js'
import { JOB_TYPE_WEIGHT } from '../abi/index.js'

export default function JobCard({ job, lang = 'ko' }) {
  const navigate = useNavigate()
  const t = useT(lang)
  const deadline = fromUnixTime(job.deadline)
  const expired = isPast(deadline)
  const locale = lang === 'ko' ? ko : enUS
  const remaining = expired ? t('jc_expired') : formatDistanceToNow(deadline, { addSuffix:true, locale })
  const premium = job.premiumReward ? ethers.formatEther(job.premiumReward) : '0'
  const weight = JOB_TYPE_WEIGHT[job.jobType] ?? 1

  return (
    <Card hover onClick={() => navigate(`/job/${job.id}`)}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, gap:12 }}>
        <JobTypeBadge type={job.jobType} />
        <JobStateBadge state={job.state} />
      </div>

      <h3
        style={{
          fontFamily:"'Syne',sans-serif",
          fontSize:'1rem',
          fontWeight:600,
          marginBottom:8,
          lineHeight:1.4,
          color:'#e8f0ff',
        }}
      >
        {job.title}
      </h3>

      {job.request && (
        <p
          style={{
            fontSize:'0.84rem',
            color:'#6b7a99',
            lineHeight:1.55,
            marginBottom:16,
            display:'-webkit-box',
            WebkitLineClamp:2,
            WebkitBoxOrient:'vertical',
            overflow:'hidden',
          }}
        >
          {job.request}
        </p>
      )}

      <Divider />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, gap:16 }}>
        <div>
          <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.92rem', color:'#00ffb4' }}>x{weight} KOIN</div>
          {Number(premium) > 0 && (
            <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.72rem', color:'#00c8ff', marginTop:2 }}>
              {t('jc_premium', premium)}
            </div>
          )}
          <div style={{ fontSize:'0.68rem', color:'#3a4560', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:2 }}>
            {t('jc_protocol_reward')}
          </div>
        </div>

        <div style={{ textAlign:'right' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end' }}>
            {!expired && job.state === 0 && <PulseDot color="green" />}
            <span style={{ fontFamily:'Share Tech Mono', fontSize:'0.8rem', color: expired ? '#3a4560' : '#6b7a99' }}>
              {remaining}
            </span>
          </div>
          <div style={{ fontFamily:'Share Tech Mono', fontSize:'0.68rem', color:'#3a4560', marginTop:2 }}>JOB #{job.id}</div>
        </div>
      </div>
    </Card>
  )
}
