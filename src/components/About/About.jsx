import TextBlockAnimation from '../TextBlockAnimation/TextBlockAnimation'
import './About.css'

const PILLARS = [
  {
    label: 'Cozinha',
    title: 'Receitas de família, porção pra dividir',
    text: 'Do escondidinho ao camarão empanado, o cardápio é pensado pra mesa cheia 🔥 porções generosas e um clima de casa, mesmo quando o salão está lotado.',
  },
  {
    label: 'Bar',
    title: 'Coquetéis autorais em cada unidade',
    text: 'Cada casa tem sua própria cartela de drinks, feita pra combinar com o clima do bairro 🔥 do clássico ao autoral.',
  },
  {
    label: 'Ocasião',
    title: 'De um almoço rápido a um aniversário',
    text: 'Happy hour de terça a domingo, mesa de família no fim de semana e espaço pra celebrar datas especiais com quem importa.',
  },
]

function About() {
  return (
    <section id="sobre" className="section about">
      <div className="container">
        <div className="about__intro">
          <div className="section-head about__head">
            <span className="eyebrow">Sobre a casa</span>
            <TextBlockAnimation blockColor="var(--color-gold)">
              <h2>Um bar de bairro com alma de cozinha de casa</h2>
            </TextBlockAnimation>
            <p>
              O Tarumã nasceu no Sudoeste e ganhou uma segunda casa no Gama 🔥
              duas unidades com a mesma essência: comida de conforto, drinks bem
              feitos e um ambiente acolhedor pra ficar depois do prato vazio.
            </p>
          </div>
          <div className="about__accent-photo">
            <img src="/images/moranga-camarao.jpg" alt="Camarão na moranga servido no Tarumã" loading="lazy" />
          </div>
        </div>

        <div className="about__steps">
          {PILLARS.map((pillar, i) => (
            <div className="about__step" key={pillar.label}>
              <div className="about__step-marker">
                <span>{`0${i + 1}`}</span>
              </div>
              <div className="about__step-body">
                <span className="eyebrow about__pillar-label">{pillar.label}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
