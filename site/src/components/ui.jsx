import { clsx } from 'clsx'

export function Btn({ children, variant = 'primary', size = 'md', full, loading, className, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[8px] font-medium tracking-[0.02em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
  const sizes = {
    sm: 'px-3 py-[6px] text-[0.78rem]',
    md: 'px-5 py-[9px] text-[0.85rem]',
    lg: 'px-7 py-[13px] text-[0.95rem]',
  }
  const variants = {
    primary:
      'bg-[#00ffb4] text-[#050810] font-semibold shadow-[0_0_20px_rgba(0,255,180,.3)] hover:-translate-y-px hover:bg-[#00e8a2] hover:shadow-[0_0_30px_rgba(0,255,180,.5)]',
    outline: 'border border-[#00ffb4] bg-transparent text-[#00ffb4] hover:bg-[rgba(0,255,180,.08)]',
    ghost:
      'border border-[rgba(0,255,180,.3)] bg-transparent text-[#6b7a99] hover:border-[#00ffb4] hover:text-[#00ffb4]',
    danger: 'border border-[#ff4466] bg-transparent text-[#ff4466] hover:bg-[rgba(255,68,102,.08)]',
    surface: 'border border-[rgba(0,255,180,.1)] bg-[#111928] text-[#e8f0ff] hover:border-[rgba(0,255,180,.3)]',
  }

  return (
    <button className={clsx(base, sizes[size], variants[variant], full && 'w-full', className)} {...props}>
      {loading ? <span className="animate-spin">o</span> : children}
    </button>
  )
}

export function Badge({ children, color = 'green', className }) {
  const colors = {
    green: 'border-[rgba(0,255,180,.2)] bg-[rgba(0,255,180,.08)] text-[#00ffb4]',
    blue: 'border-[rgba(0,200,255,.2)] bg-[rgba(0,200,255,.08)] text-[#00c8ff]',
    purple: 'border-[rgba(124,58,237,.25)] bg-[rgba(124,58,237,.1)] text-[#a78bfa]',
    yellow: 'border-[rgba(255,170,0,.2)] bg-[rgba(255,170,0,.08)] text-[#ffaa00]',
    red: 'border-[rgba(255,68,102,.2)] bg-[rgba(255,68,102,.08)] text-[#ff4466]',
    dim: 'border-[rgba(58,69,96,.4)] bg-[rgba(58,69,96,.2)] text-[#6b7a99]',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded border px-2 py-[2px] font-mono text-[0.68rem] uppercase tracking-[0.08em]',
        colors[color],
        className
      )}
    >
      {children}
    </span>
  )
}

export function Card({ children, className, hover, onClick }) {
  return (
    <div
      className={clsx(
        'rounded-[12px] border border-[rgba(0,255,180,.10)] bg-[#0c1220] p-6',
        hover &&
          'cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:border-[rgba(0,255,180,.28)] hover:shadow-[0_8px_32px_rgba(0,0,0,.3)]',
        className
      )}
      onClick={onClick}
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
    <span className="mb-4 inline-block rounded border border-[rgba(0,255,180,.25)] px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-[#00ffb4]">
      {children}
    </span>
  )
}

export function Field({ label, hint, children, className }) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {label ? <label className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[#6b7a99]">{label}</label> : null}
      {children}
      {hint ? <span className="text-[0.72rem] leading-[1.4] text-[#3a4560]">{hint}</span> : null}
    </div>
  )
}

export function Divider({ className }) {
  return <div className={clsx('border-t border-[rgba(0,255,180,.08)]', className)} />
}

export function PulseDot({ color = 'green' }) {
  const tone =
    color === 'green'
      ? 'bg-[#00ffb4] shadow-[0_0_6px_#00ffb4]'
      : color === 'blue'
        ? 'bg-[#00c8ff] shadow-[0_0_6px_#00c8ff]'
        : 'bg-[#ffaa00] shadow-[0_0_6px_#ffaa00]'

  return <span className={clsx('inline-block h-[6px] w-[6px] animate-pulse rounded-full', tone)} />
}

export function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin" height={size} viewBox="0 0 24 24" width={size}>
      <circle cx="12" cy="12" fill="none" r="10" stroke="rgba(0,255,180,.2)" strokeWidth="3" />
      <path d="M12 2 a10 10 0 0 1 10 10" fill="none" stroke="#00ffb4" strokeLinecap="round" strokeWidth="3" />
    </svg>
  )
}

export function TxLink({ hash }) {
  if (!hash) return null
  const short = `${hash.slice(0, 10)}...${hash.slice(-6)}`

  return (
    <a
      className="flex items-center gap-1 font-mono text-[0.75rem] text-[#00ffb4] hover:underline"
      href={`https://scan.worldland.foundation/tx/${hash}`}
      rel="noreferrer"
      target="_blank"
    >
      tx {short}
    </a>
  )
}

export function AddrLink({ addr }) {
  if (!addr) return <span className="font-mono text-[0.75rem] text-[#3a4560]">n/a</span>
  const short = `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <a
      className="font-mono text-[0.75rem] text-[#6b7a99] transition-colors hover:text-[#00ffb4]"
      href={`https://scan.worldland.foundation/address/${addr}`}
      rel="noreferrer"
      target="_blank"
    >
      {short}
    </a>
  )
}

export function JobTypeBadge({ type }) {
  const map = { 0: ['Simple', 'green'], 1: ['General', 'blue'], 2: ['Collective', 'purple'] }
  const [label, color] = map[type] ?? ['Unknown', 'dim']
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
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#3a4560]">
      <span className="font-mono text-[0.78rem] tracking-[0.18em] text-[#00ffb4]">NO DATA</span>
      <span className="text-sm">{message}</span>
    </div>
  )
}
