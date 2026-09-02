import { useState } from 'react'
import { useUnidades } from '../../hooks/useUnidades'
import ReservationModal from '../ReservationModal/ReservationModal'
import './Locations.css'

function Locations() {
  const { unidades, loading } = useUnidades()
  const [reservaPara, setReservaPara] = useState(null)

  return (
    <section id="unidades" className="section locations">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Unidades</span>
          <h2>Sudoeste ou Gama 🔥 reserve na hora</h2>
          <p>
            Endereço, horário, reserva por WhatsApp e delivery por iFood de
            cada unidade, sem precisar sair desta página.
          </p>
        </div>

        {loading && <p className="menu__loading">Carregando unidades...</p>}

        <div className="locations__grid">
          {unidades.map((unit) => (
            <article className="location-card" key={unit.slug}>
              <div className="location-card__photo">
                <img src={unit.foto_url} alt={`Prato servido na unidade ${unit.nome}`} loading="lazy" />
              </div>

              <div className="location-card__body">
                <header className="location-card__header">
                  <span className="eyebrow">{unit.tagline}</span>
                  <h3>{unit.nome}</h3>
                </header>

                <p className="location-card__address">{unit.endereco}</p>

                <dl className="location-card__hours">
                  {unit.horarios_funcionamento.map((h) => (
                    <div key={h.dia}>
                      <dt>{h.dia}</dt>
                      <dd>{h.horario}</dd>
                    </div>
                  ))}
                </dl>

                {unit.telefone && <p className="location-card__phone">{unit.telefone}</p>}

                <div className="location-card__actions">
                  <button className="btn btn-primary" onClick={() => setReservaPara(unit)}>
                    Reservar mesa
                  </button>
                  <a className="btn btn-outline" href={unit.link_ifood} target="_blank" rel="noreferrer">
                    Pedir no iFood
                  </a>
                </div>

                <a
                  className="location-card__maps"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.maps_query)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver rota no mapa →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {reservaPara && (
        <ReservationModal
          unidades={unidades}
          unidadeInicial={reservaPara}
          onClose={() => setReservaPara(null)}
        />
      )}
    </section>
  )
}

export default Locations
