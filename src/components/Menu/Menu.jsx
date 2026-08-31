import { useState } from 'react'
import { useUnitStore } from '../../store/useUnitStore'
import { useUnidades } from '../../hooks/useUnidades'
import { useProdutos } from '../../hooks/useProdutos'
import QuickViewModal from '../QuickViewModal/QuickViewModal'
import './Menu.css'

function Menu() {
  const { unitSlug, setUnit } = useUnitStore()
  const { unidades } = useUnidades()
  const active = unidades.find((u) => u.slug === unitSlug) || unidades[0]
  const { produtos, loading } = useProdutos(active?.id, { apenasFavoritos: true })
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  if (!active) return null

  return (
    <section id="cardapio" className="section menu">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Cardápio &amp; drinks</span>
          <h2>Escolha a unidade, veja tudo</h2>
          <p>
            Cada casa do Tarumã tem cardápio e cartela de drinks próprios.
            Selecione a unidade mais perto de você para abrir o material
            oficial atualizado.
          </p>
        </div>

        <div className="menu__tabs" role="tablist" aria-label="Selecionar unidade">
          {unidades.map((u) => (
            <button
              key={u.slug}
              role="tab"
              aria-selected={unitSlug === u.slug}
              className={`menu__tab${unitSlug === u.slug ? ' menu__tab--active' : ''}`}
              onClick={() => setUnit(u.slug)}
            >
              {u.nome}
            </button>
          ))}
        </div>

        <div className="menu__links">
          <a className="menu__link-card" href={active.link_cardapio_pdf} target="_blank" rel="noreferrer">
            <span className="eyebrow">Cardápio</span>
            <strong>Pratos &amp; porções — {active.nome}</strong>
            <span className="menu__link-arrow">Ver cardápio completo →</span>
          </a>
          <a className="menu__link-card" href={active.link_drinks_pdf} target="_blank" rel="noreferrer">
            <span className="eyebrow">Bar</span>
            <strong>Cartela de drinks — {active.nome}</strong>
            <span className="menu__link-arrow">Ver drinks →</span>
          </a>
        </div>

        <div className="menu__highlights">
          <span className="eyebrow menu__highlights-label">Favoritos da casa — {active.nome}</span>

          {loading && <p className="menu__loading">Carregando cardápio...</p>}

          {!loading && produtos.length === 0 && (
            <p className="menu__loading">Nenhum destaque cadastrado ainda para esta unidade.</p>
          )}

          <div className="menu__highlights-grid">
            {produtos.map((p, i) => (
              <figure
                className={`menu__dish${i % 2 === 1 ? ' menu__dish--offset' : ''}${
                  p.prato_da_semana ? ' menu__dish--semana' : ''
                }`}
                key={p.id}
              >
                <button className="menu__dish-photo" onClick={() => setProdutoSelecionado(p)}>
                  <img src={p.imagem_url} alt={p.nome} loading="lazy" />
                  {p.prato_da_semana && <span className="menu__dish-badge">Prato da semana</span>}
                </button>
                <figcaption>
                  <span className="menu__highlight-category">{p.categorias?.nome}</span>
                  <span className="menu__highlight-item">{p.nome}</span>
                  <span className="menu__highlight-note">{p.descricao}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {produtoSelecionado && (
        <QuickViewModal
          produto={produtoSelecionado}
          unidade={active}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
    </section>
  )
}

export default Menu
