import { toast } from "react-hot-toast"
import { Link, NavLink, useLocation } from "react-router-dom"
import useStore from "../lib/store.js"
import { Btn, PulseDot } from "./ui.jsx"

const copy = {
  ko: {
    landingLinks: [
      { label: "Products", href: "#products" },
      { label: "Resources", href: "#resources" },
      { label: "Core Tools", href: "#core-tools" },
      { label: "Proova", to: "/proova" },
    ],
    appLinks: [
      { label: "Ecosystem", to: "/" },
      { label: "Market", to: "/marketplace" },
      { label: "Providers", to: "/providers" },
      { label: "Proova", to: "/proova" },
      { label: "Dashboard", to: "/dashboard" },
    ],
    providerRegister: "Open Providers",
    walletConnect: "Connect Wallet",
    switchChain: "Switch Chain",
    switched: "Switched to Worldland network.",
    connect: "Connect",
    connecting: "Connecting",
    disconnect: "Disconnect",
  },
  en: {
    landingLinks: [
      { label: "Products", href: "#products" },
      { label: "Resources", href: "#resources" },
      { label: "Core Tools", href: "#core-tools" },
      { label: "Proova", to: "/proova" },
    ],
    appLinks: [
      { label: "Ecosystem", to: "/" },
      { label: "Market", to: "/marketplace" },
      { label: "Providers", to: "/providers" },
      { label: "Proova", to: "/proova" },
      { label: "Dashboard", to: "/dashboard" },
    ],
    providerRegister: "Open Providers",
    walletConnect: "Connect Wallet",
    switchChain: "Switch Chain",
    switched: "Switched to Worldland network.",
    connect: "Connect",
    connecting: "Connecting",
    disconnect: "Disconnect",
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

  const ui = copy[lang] ?? copy.en
  const isLanding = location.pathname === "/"
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null

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
      toast.success(ui.switched)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className={`site-nav${isLanding ? " site-nav--landing" : ""}`}>
      <Link className="site-nav__brand" to="/">
        <div className="site-nav__brand-mark">
          <div className="site-nav__brand-core" />
        </div>
        <span className="site-nav__brand-label">KOINARA</span>
      </Link>

      <ul className="site-nav__links">
        {(isLanding ? ui.landingLinks : ui.appLinks).map((item) => (
          <li key={item.label}>
            {"href" in item ? (
              <a className="site-nav__link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <NavLink
                className={({ isActive }) => `site-nav__link${isActive ? " site-nav__link--active" : ""}`}
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
          {["ko", "en"].map((value) => (
            <button
              className={`site-nav__lang-button${lang === value ? " site-nav__lang-button--active" : ""}`}
              key={value}
              onClick={() => setLang(value)}
              type="button"
            >
              {value === "ko" ? "KR" : "US"}
            </button>
          ))}
        </div>

        {isLanding ? (
          <>
            <Link className="site-nav__button site-nav__button--ghost" to="/providers">
              {ui.providerRegister}
            </Link>
            {address ? (
              !isCorrectChain ? (
                <button className="site-nav__button site-nav__button--primary" onClick={handleSwitch} type="button">
                  {ui.switchChain}
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
                {isConnecting ? ui.connecting : ui.walletConnect}
              </button>
            )}
          </>
        ) : address ? (
          <>
            {!isCorrectChain ? (
              <Btn size="sm" variant="danger" onClick={handleSwitch}>
                {ui.switchChain}
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
              {ui.disconnect}
            </Btn>
          </>
        ) : (
          <Btn size="sm" onClick={handleConnect}>
            {isConnecting ? ui.connecting : ui.connect}
          </Btn>
        )}
      </div>
    </nav>
  )
}
