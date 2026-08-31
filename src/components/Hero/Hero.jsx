import './Hero.css'

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="eyebrow">Brasília · Sudoeste &amp; Gama</span>
          <h1 className="hero__title">
            Gastronomia contemporânea,
            <span> drinks autorais.</span>
          </h1>
          <p className="hero__lead">
            Duas unidades, uma só mesa: cardápio, drinks, reservas e delivery
            do Tarumã reunidos aqui — sem precisar procurar em cinco lugares
            diferentes.
          </p>
          <div className="hero__actions">
            <a href="#unidades" className="btn btn-primary">
              Fazer reserva
            </a>
            <a href="#cardapio" className="btn btn-outline">
              Ver cardápio
            </a>
          </div>
        </div>

        <div className="hero__media">
          <img src="/images/mesa-brinde.jpg" alt="Mesa de amigos brindando no Tarumã" />
          <div className="hero__media-tag">
            <img src="/images/logo.png" alt="" />
            <span>Sudoeste &amp; Gama</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
