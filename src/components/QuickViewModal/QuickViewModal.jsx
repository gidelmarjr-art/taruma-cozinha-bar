import { useEffect, useState } from 'react'
import { useAvaliacoes, enviarAvaliacao } from '../../hooks/useAvaliacoes'
import { isSupabaseConfigured } from '../../lib/supabase'
import './QuickViewModal.css'

function Stars({ nota }) {
  return (
    <span className="quick-view__stars" aria-label={`${nota} de 5 estrelas`}>
      {'★'.repeat(nota)}
      {'☆'.repeat(5 - nota)}
    </span>
  )
}

function QuickViewModal({ produto, unidade, onClose }) {
  const { avaliacoes, loading } = useAvaliacoes(produto?.id)
  const [form, setForm] = useState({ nome: '', nota: 5, comentario: '' })
  const [enviado, setEnviado] = useState(false)
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

  if (!produto) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    const { success } = await enviarAvaliacao({
      produtoId: produto.id,
      nomeCliente: form.nome,
      nota: Number(form.nota),
      comentario: form.comentario,
    })
    setEnviando(false)
    if (success) {
      setEnviado(true)
      setForm({ nome: '', nota: 5, comentario: '' })
    }
  }

  return (
    <div className="quick-view__backdrop" onClick={onClose}>
      <div className="quick-view" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view__close" onClick={onClose} aria-label="Fechar">
          ✕
        </button>

        <div className="quick-view__photo">
          <img src={produto.imagem_url} alt={produto.nome} />
        </div>

        <div className="quick-view__body">
          {produto.categorias?.nome && <span className="eyebrow">{produto.categorias.nome}</span>}
          <h3>{produto.nome}</h3>
          {produto.porcao && <p className="quick-view__porcao">{produto.porcao}</p>}
          {produto.descricao && <p className="quick-view__desc">{produto.descricao}</p>}
          {produto.preco && <p className="quick-view__preco">R$ {Number(produto.preco).toFixed(2)}</p>}

          <div className="quick-view__actions">
            {unidade?.link_ifood && (
              <a className="btn btn-primary" href={unidade.link_ifood} target="_blank" rel="noreferrer">
                Pedir no iFood
              </a>
            )}
            {unidade?.whatsapp_url && (
              <a className="btn btn-outline" href={unidade.whatsapp_url} target="_blank" rel="noreferrer">
                Reservar via WhatsApp
              </a>
            )}
          </div>

          {isSupabaseConfigured && (
            <div className="quick-view__reviews">
              <span className="eyebrow">Avaliações</span>
              {loading && <p className="quick-view__hint">Carregando...</p>}
              {!loading && avaliacoes.length === 0 && (
                <p className="quick-view__hint">Ainda sem avaliações 🔥 seja o primeiro a avaliar.</p>
              )}
              <ul>
                {avaliacoes.map((a) => (
                  <li key={a.id}>
                    <Stars nota={a.nota} />
                    <strong>{a.nome_cliente}</strong>
                    {a.comentario && <p>{a.comentario}</p>}
                  </li>
                ))}
              </ul>

              {enviado ? (
                <p className="quick-view__hint">
                  Obrigado! Sua avaliação foi enviada e aparece aqui assim que for aprovada.
                </p>
              ) : (
                <form className="quick-view__form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    required
                    value={form.nome}
                    onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  />
                  <select
                    value={form.nota}
                    onChange={(e) => setForm((f) => ({ ...f, nota: e.target.value }))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} estrela{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Conte como foi (opcional)"
                    value={form.comentario}
                    onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
                  />
                  <button className="btn btn-primary" type="submit" disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar avaliação'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuickViewModal
