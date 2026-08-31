import { useEffect, useState } from 'react'
import { useUnidades } from '../../hooks/useUnidades'
import UnitSwitcher from '../UnitSwitcher/UnitSwitcher'
import './Header.css'

const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#unidades', label: 'Unidades' },
  { href: '#contato', label: 'Contato' },
]

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { unidades } = useUnidades()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#top" className="header__brand">
          <img src="/images/logo.png" alt="Tarumã Cozinha e Bar" />
        </a>

        <nav className="header__nav header__nav--desktop" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__right">
          <UnitSwitcher unidades={unidades} compact />
          <a href="#unidades" className="btn btn-primary header__cta">
            Reservar
          </a>
        </div>

        <button
          className="header__toggle"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav className="header__nav header__nav--mobile" aria-label="Navegação móvel">
          <UnitSwitcher unidades={unidades} />
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#unidades" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Reservar
          </a>
        </nav>
      )}
    </header>
  )
}

export default Header
