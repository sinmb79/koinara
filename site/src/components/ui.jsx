import { clsx } from 'clsx'

export function Btn({ children, variant = 'primary', size = 'md', full, loading, className, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-[8px] tracking-[0.02em] disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'text-[0.78rem] px-3 py-[6px]',
    md: 'text-[0.85rem] px-5 py-[9px]',
    lg: 'text-[0.95rem] px-7 py-[13px]',
  }
  const variants = {
    primary: 'bg-[#00ffb4] text-[#050810] font-semibold shadow-[0_0_20px_rgba(0,255,180,.3)] hover:bg-[#00e8a2] hover:shadow-[0_0_30px_rgba(0,255,180,.5)] hover:-translate-y-px',
    outline: 'bg-transparent border border-[#00ffb4] text-[#00ffb4] hover:bg-[rgba(0,255,180,.08)]',
    ghost: 'bg-transparent border border-[rgba(0,255,180,.3)] text-[#6b7a99] hover:border-[#00ffb4] hover:text-[#00ffb4]',
    danger: 'bg-transparent border border-[#ff4466] text-[#ff4466] hover:bg-[rgba(255,68,102,.08)]',
    surface: 'bg-[#111928] border border-[rgba(0,255,180,.1)] text-[#e8f0ff] hover:border-[rgba(0,255,180,.3)]',
  }

  return (
    <button className={clsx(base, sizes[size], variants[variant], full && 'w-full', className)} {...props}>
      {loading ? <Spinner size={14} /> : children}
    </button>
  )
}

export function Badge({ children, color = 'green', className }) {
  const colors = {
    green: 'bg-[rgba(0,255,180,.08)] border-[rgba(0,255,180,.2)] text-[#00ffb4]',
    blue: 'bg-[rgba(0,200,255,.08)] border-[rgba(0,200,255,.2)] text-[#00c8ff]',
    purple: 'bg-[rgba(124,58,237,.1)] border-[rgba(124,58,237,.25)] text-[#a78bfa]',
    yellow: 'bg-[rgba(255,170,0,.08)] border-[rgba(255,170,0,.2)] text-[#ffaa00]',
    red: 'bg-[rgba(255,68,102,.08)] border-[rgba(255,68,102,.2)] text-[#ff4466]',
    dim: 'bg-[rgba(58,69,96,.2)] border-[rgba(58,69,96,.4)] text-[#6b7a99]',
  }

  return (
    <span className={clsx('inline-flex items-center gap-1 font-mono text-[0.68rem] px-2 py-[2px] rounded border tracking-[0.08em] uppercase', colors[color], className)}>
      {children}
    </span>
  )
}

export function Card({ children, className, hover, onClick, style, ...props }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={clsx(
        'bg-[#0c1220] border border-[rgba(0,255,180,.10)] rounded-[12px] p-6',
        hover && 'transition-all duration-200 hover:border-[rgba(0,255,180,.28)] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(0,0,0,.3)] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Mono({ children, className }) {
  return <span className={clsx('font-mono text-[#00ffb4]', className)}>{children}</span>
}

export function Tag({ children }) {
  return (
    <span className="inline-block font-mono text-[0.72rem] text-[#00ffb4] tracking-[0.15em] uppercase mb-4 px-3 py-1 border border-[rgba(0,255,180,.25)] rounded">
      {children}
    </span>
  )
}

export function Field({ label, hint, children, className }) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {label && <label className="text-[0.75rem] font-medium text-[#6b7a99] uppercase tracking-[0.08em]">{label}</label>}
      {children}
      {hint && <span className="text-[0.72rem] text-[#3a4560] leading-[1.4]">{hint}</span>}
    </div>
  )
}

export function Divider({ className, style }) {
  return <div style={style} className={clsx('border-t border-[rgba(0,255,180,.08)]', className)} />
}

export function PulseDot({ color = 'green' }) {
  const tone = color === 'green'
    ? 'bg-[#00ffb4] shadow-[0_0_6px_#00ffb4]'
    : color === 'blue'
      ? 'bg-[#00c8ff] shadow-[0_0_6px_#00c8ff]'
      : 'bg-[#ffaa00] shadow-[0_0_6px_#ffaa00]'

  return <span className={clsx('inline-block w-[6px] h-[6px] rounded-full animate-pulse', tone)} />
}

export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="rgba(0,255,180,.2)" strokeWidth="3" fill="none" />
      <path d="M12 2 a10 10 0 0 1 10 10" stroke="#00ffb4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function TxLink({ hash }) {
  if (!hash) return null
  const short = `${hash.slice(0,10)}...${hash.slice(-6)}`

  return (
    <a
      href={`https://scan.worldland.foundation/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[0.75rem] text-[#00ffb4] hover:underline flex items-center gap-1"
    >
      tx {short}
    </a>
  )
}

export function AddrLink({ addr }) {
  if (!addr) return <span className="font-mono text-[0.75rem] text-[#3a4560]">--</span>
  const short = `${addr.slice(0,6)}...${addr.slice(-4)}`

  return (
    <a
      href={`https://scan.worldland.foundation/address/${addr}`}
      target="_blank"
      rel="noreferrer"
      className="font-mono text-[0.75rem] text-[#6b7a99] hover:text-[#00ffb4] transition-colors"
    >
      {short}
    </a>
  )
}

export function JobTypeBadge({ type }) {
  const map = { 0:['Simple','green'], 1:['General','blue'], 2:['Collective','purple'] }
  const [label, color] = map[type] ?? ['Unknown','dim']
  return <Badge color={color}>{label}</Badge>
}

export function JobStateBadge({ state }) {
  const map = {
    0: ['OPEN', 'green'],
    1: ['FULFILLED', 'blue'],
    2: ['REJECTED', 'red'],
    3: ['EXPIRED', 'dim'],
    4: ['CANCELLED', 'dim'],
  }
  const [label, color] = map[state] ?? ['UNKNOWN', 'dim']
  return <Badge color={color}>{label}</Badge>
}

export function Empty({ message = '데이터가 없습니다.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#3a4560]">
      <span className="font-mono text-2xl">//</span>
      <span className="text-sm">{message}</span>
    </div>
  )
}
