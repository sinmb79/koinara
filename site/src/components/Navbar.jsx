import { toast } from 'react-hot-toast'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useStore from '../lib/store.js'
import { useT } from '../lib/i18n.js'
import { Btn, PulseDot } from './ui.jsx'

const landingCopy = {
  ko: {
    marketplace: '마켓플레이스',
    providers: '공급자',
    submit: '작업 등록',
    koin: 'KOIN',
    providerRegister: '공급자 등록',
    walletConnect: '지갑 연결',
    switchChain: '체인 전환',
    switched: 'Worldland 네트워크로 전환했습니다.',
  },
  en: {
    marketplace: 'Marketplace',
    providers: 'Providers',
    submit: 'Post Job',
    koin: 'KOIN',
    providerRegister: 'Register Provider',
    walletConnect: 'Connect Wallet',
    switchChain: 'Switch Chain',
    switched: 'Switched to Worldland network.',
  },
}

export default function Navbar() {
  const location = useLocation()
  const {
    address,
    connect,
    disconnect,
    isConnecting,
    isCorrectChain,
    koinBalance,
    lang,
    setLang,
    switchChain,
  } = useStore()
  const t = useT(lang)
  const copy = landingCopy[lang] ?? landingCopy.ko
  const isLanding = location.pathname === '/'

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
      toast.success(copy.switched)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null

  const landingLinks = [
    { label: copy.marketplace, href: '#marketplace' },
    { label: copy.providers, href: '#providers' },
    { label: copy.submit, href: '#submit' },
    { label: copy.koin, href: '#koin' },
  ]

  const appLinks = [
    { label: t('nav_marketplace'), to: '/marketplace' },
    { label: t('nav_submit'), to: '/submit' },
    { label: t('nav_providers'), to: '/providers' },
    { label: lang === 'ko' ? '생태계' : 'Ecosystem', to: '/dapps' },
    { label: t('nav_dashboard'), to: '/dashboard' },
  ]

  return (
    <nav className={`site-nav${isLanding ? ' site-nav--landing' : ''}`}>
      <Link className="site-nav__brand" to="/">
        <div className="site-nav__brand-mark">
          <div className="site-nav__brand-core" />
        </div>
        <span className="site-nav__brand-label">KOINARA</span>
      </Link>

      <ul className="site-nav__links">
        {(isLanding ? landingLinks : appLinks).map((item) => (
          <li key={item.label}>
            {'href' in item ? (
              <a className="site-nav__link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <NavLink
                className={({ isActive }) => `site-nav__link${isActive ? ' site-nav__link--active' : ''}`}
                to={item.to}
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="site-nav__actions">
        <div className="site-nav__lang">
          {['ko', 'en'].map((value) => (
            <button
              className={`site-nav__lang-button${lang === value ? ' site-nav__lang-button--active' : ''}`}
              key={value}
              onClick={() => setLang(value)}
              type="button"
            >
              {value === 'ko' ? 'KR' : 'US'}
            </button>
          ))}
        </div>

        {isLanding ? (
          <>
            <a className="site-nav__button site-nav__button--ghost" href="#providers">
              {copy.providerRegister}
            </a>
            {address ? (
              !isCorrectChain ? (
                <button className="site-nav__button site-nav__button--primary" onClick={handleSwitch} type="button">
                  {copy.switchChain}
                </button>
              ) : (
                <button className="site-nav__button site-nav__button--wallet" onClick={disconnect} type="button">
                  <PulseDot color="green" />
                  <span>{shortAddress}</span>
                </button>
              )
            ) : (
              <button
                className="site-nav__button site-nav__button--primary"
                disabled={isConnecting}
                onClick={handleConnect}
                type="button"
              >
                {isConnecting ? t('nav_connecting') : copy.walletConnect}
              </button>
            )}
          </>
        ) : address ? (
          <>
            {!isCorrectChain ? (
              <Btn size="sm" variant="danger" onClick={handleSwitch}>
                {t('nav_switch_chain')}
              </Btn>
            ) : (
              <div className="site-nav__wallet-pill">
                <PulseDot color="green" />
                <span className="site-nav__wallet-address">{shortAddress}</span>
                <span className="site-nav__wallet-divider">|</span>
                <span className="site-nav__wallet-balance">{Number(koinBalance).toFixed(1)} KOIN</span>
              </div>
            )}
            <Btn size="sm" variant="ghost" onClick={disconnect}>
              {t('nav_disconnect')}
            </Btn>
          </>
        ) : (
          <Btn size="sm" onClick={handleConnect}>
            {isConnecting ? t('nav_connecting') : t('nav_connect')}
          </Btn>
        )}
      </div>
    </nav>
  )
}
