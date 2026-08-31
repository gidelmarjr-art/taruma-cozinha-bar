import { social } from '../../data/seed'
import { useUnidades } from '../../hooks/useUnidades'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()
  const { unidades } = useUnidades()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/images/logo.png" alt="" />
          <div>
            <span className="footer__logo">Tarumã</span>
            <br />
            <span className="eyebrow">Cozinha e Bar</span>
          </div>
        </div>

        <div className="footer__cols">
          <div>
            <span className="eyebrow">Unidades</span>
            <ul>
              {unidades.map((unit) => (
                <li key={unit.slug}>
                  <a href="#unidades">{unit.nome}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Navegação</span>
            <ul>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#cardapio">Cardápio</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
          <div>
            <span className="eyebrow">Redes</span>
            <ul>
              <li>
                <a href={social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {year} Tarumã Cozinha e Bar. Todos os direitos reservados.</span>
      </div>
    </footer>
  )
}

export default Footer
