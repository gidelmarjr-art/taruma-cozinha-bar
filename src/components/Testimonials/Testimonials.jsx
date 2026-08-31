import './Testimonials.css'

const NOTES = [
  {
    tag: 'Ambiente',
    text: 'Clientes costumam elogiar o clima acolhedor da casa, especialmente em noites de música ao vivo e happy hour.',
  },
  {
    tag: 'Atendimento',
    text: 'Garçons e equipe são citados com frequência como um dos pontos fortes da experiência, com bom atendimento nas duas unidades.',
  },
  {
    tag: 'Ocasiões especiais',
    text: 'A casa é procurada para aniversários e comemorações em família, com espaço pra grupos maiores.',
  },
]

function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">O que dizem sobre a casa</span>
          <h2>Reconhecido pelo ambiente e pelo atendimento</h2>
        </div>

        <div className="testimonials__grid">
          {NOTES.map((n) => (
            <div className="testimonials__card" key={n.tag}>
              <span className="eyebrow">{n.tag}</span>
              <p>{n.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
