import { useState } from 'react'
import { social } from '../../data/seed'
import { useUnidades } from '../../hooks/useUnidades'
import ReservationModal from '../ReservationModal/ReservationModal'
import './CTA.css'

function CTA() {
  const { unidades } = useUnidades()
  const [reservaAberta, setReservaAberta] = useState(false)

  return (
    <section id="contato" className="cta">
      <div className="cta__photo">
        <img src="/images/peixe-legumes.jpg" alt="Prato do Tarumã pronto para servir" loading="lazy" />
      </div>

      <div className="cta__panel">
        <span className="eyebrow">Reserve agora</span>
        <h2>
          Escolha a unidade
          <br />e garanta sua mesa
        </h2>
        <p>
          Reserva direto pelo WhatsApp — sem fila, sem espera. Escolha a casa
          mais perto de você.
        </p>
        <div className="cta__actions">
          <button className="btn btn-primary" onClick={() => setReservaAberta(true)}>
            Reservar mesa
          </button>
        </div>
        <a className="cta__ig" href={social.instagram} target="_blank" rel="noreferrer">
          {social.instagramHandle} no Instagram →
        </a>
      </div>

      {reservaAberta && unidades.length > 0 && (
        <ReservationModal unidades={unidades} unidadeInicial={unidades[0]} onClose={() => setReservaAberta(false)} />
      )}
    </section>
  )
}

export default CTA
