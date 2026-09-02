import { useEffect, useState } from 'react'
import { criarReserva } from '../../hooks/useReservas'
import './ReservationModal.css'

function ReservationModal({ unidades, unidadeInicial, onClose }) {
  const [form, setForm] = useState({
    unidadeSlug: unidadeInicial?.slug || unidades[0]?.slug,
    nome: '',
    telefone: '',
    data: '',
    horario: '',
    pessoas: 2,
    observacoes: '',
  })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const unidadeSelecionada = unidades.find((u) => u.slug === form.unidadeSlug) || unidades[0]

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    const { whatsappUrl } = await criarReserva({
      unidade: unidadeSelecionada,
      nomeCliente: form.nome,
      telefone: form.telefone,
      data: form.data,
      horario: form.horario,
      pessoas: Number(form.pessoas),
      observacoes: form.observacoes,
    })
    setEnviando(false)
    window.open(whatsappUrl, '_blank', 'noreferrer')
    onClose()
  }

  return (
    <div className="reservation-modal__backdrop" onClick={onClose}>
      <div className="reservation-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="reservation-modal__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        <span className="eyebrow">Reservar mesa</span>
        <h3>Vamos garantir sua mesa</h3>
        <p className="reservation-modal__hint">
          Preencha os dados 🔥 você confirma direto pelo WhatsApp da unidade escolhida.
        </p>

        <form onSubmit={handleSubmit} className="reservation-modal__form">
          <label>
            Unidade
            <select
              value={form.unidadeSlug}
              onChange={(e) => setForm((f) => ({ ...f, unidadeSlug: e.target.value }))}
            >
              {unidades.map((u) => (
                <option key={u.slug} value={u.slug}>
                  {u.nome}
                </option>
              ))}
            </select>
          </label>

          <div className="reservation-modal__row">
            <label>
              Data
              <input
                type="date"
                required
                value={form.data}
                onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
              />
            </label>
            <label>
              Horário
              <input
                type="time"
                required
                value={form.horario}
                onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))}
              />
            </label>
          </div>

          <label>
            Pessoas
            <input
              type="number"
              min="1"
              max="30"
              required
              value={form.pessoas}
              onChange={(e) => setForm((f) => ({ ...f, pessoas: e.target.value }))}
            />
          </label>

          <label>
            Seu nome
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
          </label>

          <label>
            WhatsApp
            <input
              type="tel"
              placeholder="(61) 90000-0000"
              required
              value={form.telefone}
              onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
            />
          </label>

          <label>
            Observações (opcional)
            <textarea
              placeholder="Aniversário, restrição alimentar, etc."
              value={form.observacoes}
              onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
            />
          </label>

          <button className="btn btn-primary reservation-modal__submit" type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Confirmar via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReservationModal
