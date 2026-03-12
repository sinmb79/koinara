import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useStore from '../lib/store.js'
import { useT } from '../lib/i18n.js'
import { Btn, PulseDot } from './ui.jsx'

const MOBILE_BREAKPOINT = 900

export default function Navbar() {
  const location = useLocation()
  const {
    address,
    isConnecting,
    isCorrectChain,
    koinBalance,
    connect,
    disconnect,
    switchChain,
    lang,
    setLang,
  } = useStore()
  const t = useT(lang)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const syncViewport = () => {
      const nextIsMobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(nextIsMobile)
      if (!nextIsMobile) setMenuOpen(false)
    }

    syncViewport()
    window.addEventListener('resize', syncViewport)
    return () => window.removeEventListener('resize', syncViewport)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSwitch = async () => {
    try {
      await switchChain()
      toast.success(lang === 'ko' ? 'Worldland 네트워크로 전환되었습니다.' : 'Switched to Worldland network.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const short = address ? `${address.slice(0,6)}...${address.slice(-4)}` : null
  const navLinks = [
    [t('nav_marketplace'), '/'],
    [t('nav_submit'), '/submit'],
    [t('nav_providers'), '/providers'],
    ['생태계', '/dapps'],
    [t('nav_dashboard'), '/dashboard'],
  ]

  const languageToggle = (
    <div
      style={{
        display:'flex',
        alignItems:'center',
        background:'#0c1220',
        border:'1px solid rgba(0,255,180,.12)',
        borderRadius:8,
        padding:3,
        gap:2,
      }}
    >
      {['ko', 'en'].map((nextLang) => (
        <button
          key={nextLang}
          onClick={() => setLang(nextLang)}
          style={{
            fontFamily:"'Share Tech Mono',monospace",
            fontSize:'0.72rem',
            letterSpacing:'0.06em',
            padding:'4px 10px',
            borderRadius:6,
            border:'none',
            cursor:'pointer',
            transition:'all .18s',
            background: lang === nextLang ? 'rgba(0,255,180,0.12)' : 'transparent',
            color: lang === nextLang ? '#00ffb4' : '#3a4560',
            boxShadow: lang === nextLang ? '0 0 8px rgba(0,255,180,0.15)' : 'none',
          }}
        >
          {nextLang === 'ko' ? 'KR' : 'US'}
        </button>
      ))}
    </div>
  )

  const walletStatus = address && isCorrectChain && (
    <div
      style={{
        display:'flex',
        alignItems:'center',
        gap:10,
        background:'#0c1220',
        border:'1px solid rgba(0,255,180,.15)',
        borderRadius:8,
        padding:'8px 14px',
        fontSize:'0.78rem',
      }}
    >
      <PulseDot color="green" />
      <span style={{ fontFamily:'Share Tech Mono', color:'#6b7a99' }}>{short}</span>
      <span style={{ color:'rgba(0,255,180,.3)' }}>|</span>
      <span style={{ fontFamily:'Share Tech Mono', color:'#00ffb4' }}>{Number(koinBalance).toFixed(1)} KOIN</span>
    </div>
  )

  const walletControls = (
    <>
      {address ? (
        <>
          {!isCorrectChain && (
            <Btn variant="danger" size="sm" onClick={handleSwitch}>
              {t('nav_switch_chain')}
            </Btn>
          )}
          {walletStatus}
          <Btn variant="ghost" size="sm" onClick={disconnect}>
            {t('nav_disconnect')}
          </Btn>
        </>
      ) : (
        <Btn variant="primary" size="sm" onClick={handleConnect} loading={isConnecting}>
          {isConnecting ? t('nav_connecting') : t('nav_connect')}
        </Btn>
      )}
    </>
  )

  if (isMobile) {
    return (
      <nav
        style={{
          position:'fixed',
          top:0,
          left:0,
          right:0,
          zIndex:100,
          background:'rgba(5,8,16,0.92)',
          backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(0,255,180,0.1)',
        }}
      >
        <div
          style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            gap:12,
            minHeight:68,
            padding:'0 16px',
          }}
        >
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
            <div
              style={{
                width:28,
                height:28,
                border:'1.5px solid #00ffb4',
                borderRadius:6,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                boxShadow:'0 0 12px rgba(0,255,180,0.35)',
              }}
            >
              <div style={{ width:10, height:10, background:'#00ffb4', borderRadius:2, boxShadow:'0 0 8px #00ffb4' }} />
            </div>
            <span
              style={{
                fontFamily:"'Share Tech Mono',monospace",
                fontSize:'1rem',
                color:'#00ffb4',
                letterSpacing:'0.08em',
                textShadow:'0 0 20px rgba(0,255,180,0.4)',
              }}
            >
              KOINARA
            </span>
          </Link>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {languageToggle}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              style={{
                minWidth:72,
                padding:'8px 10px',
                borderRadius:8,
                border:'1px solid rgba(0,255,180,.2)',
                background:'rgba(0,255,180,.05)',
                color:'#00ffb4',
                fontFamily:"'Share Tech Mono',monospace",
                fontSize:'0.72rem',
                letterSpacing:'0.08em',
              }}
            >
              {menuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            style={{
              padding:'12px 16px 16px',
              borderTop:'1px solid rgba(0,255,180,.08)',
              display:'flex',
              flexDirection:'column',
              gap:12,
            }}
          >
            <div style={{ display:'grid', gap:8 }}>
              {navLinks.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  style={({ isActive }) => ({
                    display:'block',
                    padding:'10px 12px',
                    borderRadius:10,
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:'0.92rem',
                    color: isActive ? '#00ffb4' : '#d5def0',
                    background: isActive ? 'rgba(0,255,180,.06)' : 'rgba(12,18,32,.65)',
                    border: `1px solid ${isActive ? 'rgba(0,255,180,.2)' : 'rgba(0,255,180,.08)'}`,
                    textDecoration:'none',
                  })}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {walletStatus}
              {!address && (
                <Btn variant="primary" size="sm" full onClick={handleConnect} loading={isConnecting}>
                  {isConnecting ? t('nav_connecting') : t('nav_connect')}
                </Btn>
              )}
              {address && !isCorrectChain && (
                <Btn variant="danger" size="sm" full onClick={handleSwitch}>
                  {t('nav_switch_chain')}
                </Btn>
              )}
              {address && (
                <Btn variant="ghost" size="sm" full onClick={disconnect}>
                  {t('nav_disconnect')}
                </Btn>
              )}
            </div>
          </div>
        )}
      </nav>
    )
  }

  return (
    <nav
      style={{
        position:'fixed',
        top:0,
        left:0,
        right:0,
        zIndex:100,
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        padding:'0 clamp(20px, 5vw, 40px)',
        height:64,
        background:'rgba(5,8,16,0.88)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(0,255,180,0.1)',
      }}
    >
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
        <div
          style={{
            width:28,
            height:28,
            border:'1.5px solid #00ffb4',
            borderRadius:6,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            boxShadow:'0 0 12px rgba(0,255,180,0.35)',
          }}
        >
          <div style={{ width:10, height:10, background:'#00ffb4', borderRadius:2, boxShadow:'0 0 8px #00ffb4' }} />
        </div>
        <span
          style={{
            fontFamily:"'Share Tech Mono',monospace",
            fontSize:'1.15rem',
            color:'#00ffb4',
            letterSpacing:'0.08em',
            textShadow:'0 0 20px rgba(0,255,180,0.4)',
          }}
        >
          KOINARA
        </span>
      </Link>

      <ul style={{ display:'flex', gap:28, listStyle:'none', margin:0, padding:0 }}>
        {navLinks.map(([label, to]) => (
          <li key={to}>
            <NavLink
              to={to}
              style={({ isActive }) => ({
                fontFamily:"'DM Sans',sans-serif",
                fontSize:'0.84rem',
                fontWeight:400,
                color: isActive ? '#00ffb4' : '#6b7a99',
                textDecoration:'none',
                letterSpacing:'0.04em',
                transition:'color .2s',
              })}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={{ display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
        {languageToggle}
        {walletControls}
      </div>
    </nav>
  )
}
