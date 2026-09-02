import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import QuickViewModal from '../../components/QuickViewModal/QuickViewModal'
import { useUnidades } from '../../hooks/useUnidades'
import { useCategorias } from '../../hooks/useCategorias'
import { useProdutos } from '../../hooks/useProdutos'
import { useUnitStore } from '../../store/useUnitStore'
import './CardapioPage.css'

const TIPOS = [
  { valor: 'comida', label: 'Comida' },
  { valor: 'drink', label: 'Drinks' },
]

function CardapioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { unidades } = useUnidades()
  const { categorias } = useCategorias()
  const { unitSlug, setUnit } = useUnitStore()
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)

  // A URL manda: ?unidade=gama entra em vigor e também atualiza o store
  // global, então o resto do site (Header, Menu na home) fica sincronizado.
  const unidadeNaUrl = searchParams.get('unidade')
  const categoriaNaUrl = searchParams.get('categoria')
  const tipoNaUrl = searchParams.get('tipo') === 'drink' ? 'drink' : 'comida'
  const slugAtivo = unidadeNaUrl || unitSlug
  const active = unidades.find((u) => u.slug === slugAtivo) || unidades[0]

  const { produtos, loading } = useProdutos(active?.id)

  // Se a categoria selecionada não pertence ao tipo (comida/drink) atual,
  // ela some da URL sozinha — evita filtro "fantasma" ao trocar de aba.
  useEffect(() => {
    if (!categoriaNaUrl) return
    const cat = categorias.find((c) => c.slug === categoriaNaUrl)
    if (cat && cat.tipo !== tipoNaUrl) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('categoria')
        return next
      })
    }
  }, [categoriaNaUrl, tipoNaUrl, categorias, setSearchParams])

  const categoriasDoTipo = useMemo(
    () => categorias.filter((c) => c.tipo === tipoNaUrl),
    [categorias, tipoNaUrl]
  )

  const categoriasComItens = useMemo(() => {
    return categoriasDoTipo
      .map((cat) => ({
        ...cat,
        itens: produtos.filter((p) => p.categoria_id === cat.id),
      }))
      .filter((cat) => cat.itens.length > 0)
      .filter((cat) => !categoriaNaUrl || cat.slug === categoriaNaUrl)
  }, [categoriasDoTipo, produtos, categoriaNaUrl])

  function atualizarParams(patch) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(patch).forEach(([chave, valor]) => {
        if (valor) next.set(chave, valor)
        else next.delete(chave)
      })
      return next
    })
  }

  function handleTrocarUnidade(slug) {
    setUnit(slug)
    atualizarParams({ unidade: slug })
  }

  function handleTrocarTipo(tipo) {
    atualizarParams({ tipo: tipo === 'comida' ? null : tipo, categoria: null })
  }

  function handleSelecionarCategoria(slug) {
    atualizarParams({ categoria: slug === categoriaNaUrl ? null : slug })
  }

  if (!active) return null

  return (
    <>
      <Header />
      <main className="cardapio-page">
        <div className="container">
          <div className="cardapio-page__head">
            <Link to="/" className="cardapio-page__back">
              ← Voltar ao início
            </Link>
            <span className="eyebrow">Cardápio completo</span>
            <h1>Tudo o que a casa serve 🔥 {active.nome}</h1>
            <p>
              Cardápio completo da unidade {active.nome}, direto do nosso site 🔥 sem PDF, sem
              precisar sair daqui.
            </p>

            <div className="cardapio-page__toolbar">
              <UnitSwitcherWrapper unidades={unidades} slugAtivo={slugAtivo} onChange={handleTrocarUnidade} />
            </div>

            <div className="cardapio-page__actions">
              {active.whatsapp_url && (
                <a className="btn btn-primary" href={active.whatsapp_url} target="_blank" rel="noreferrer">
                  Reservar via WhatsApp
                </a>
              )}
              {active.link_ifood && (
                <a className="btn btn-outline" href={active.link_ifood} target="_blank" rel="noreferrer">
                  Pedir no iFood
                </a>
              )}
            </div>
          </div>

          {/* Alternador principal: Comida ou Drinks */}
          <div className="cardapio-tipo" role="tablist" aria-label="Comida ou drinks">
            {TIPOS.map((t) => (
              <button
                key={t.valor}
                role="tab"
                aria-selected={tipoNaUrl === t.valor}
                className={`cardapio-tipo__btn${tipoNaUrl === t.valor ? ' cardapio-tipo__btn--active' : ''}`}
                onClick={() => handleTrocarTipo(t.valor)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Pills de categoria do tipo selecionado */}
          {categoriasDoTipo.length > 0 && (
            <div className="cardapio-categorias" role="tablist" aria-label="Filtrar por categoria">
              <button
                role="tab"
                aria-selected={!categoriaNaUrl}
                className={`cardapio-categorias__pill${!categoriaNaUrl ? ' cardapio-categorias__pill--active' : ''}`}
                onClick={() => atualizarParams({ categoria: null })}
              >
                Todas
              </button>
              {categoriasDoTipo.map((cat) => (
                <button
                  key={cat.slug}
                  role="tab"
                  aria-selected={categoriaNaUrl === cat.slug}
                  className={`cardapio-categorias__pill${
                    categoriaNaUrl === cat.slug ? ' cardapio-categorias__pill--active' : ''
                  }`}
                  onClick={() => handleSelecionarCategoria(cat.slug)}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          )}

          {loading && <p className="cardapio-page__hint">Carregando cardápio...</p>}

          {!loading && categoriasComItens.length === 0 && (
            <div className="cardapio-page__empty">
              <p>
                {categoriaNaUrl
                  ? `A categoria "${categorias.find((c) => c.slug === categoriaNaUrl)?.nome}" ainda está sendo cadastrada por aqui.`
                  : `O cardápio de ${tipoNaUrl === 'drink' ? 'drinks' : 'comida'} da unidade ${active.nome} ainda está sendo cadastrado por aqui.`}{' '}
                Enquanto isso, fale direto com a equipe:
              </p>
              <div className="cardapio-page__actions">
                {active.whatsapp_url && (
                  <a className="btn btn-primary" href={active.whatsapp_url} target="_blank" rel="noreferrer">
                    Chamar no WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}

          {!loading &&
            categoriasComItens.map((cat) => (
              <section className="cardapio-page__category" key={cat.id}>
                <h2>{cat.nome}</h2>
                <div className="cardapio-page__grid">
                  {cat.itens.map((p) => (
                    <button
                      className="cardapio-item"
                      key={p.id}
                      onClick={() => setProdutoSelecionado(p)}
                    >
                      {p.imagem_url ? (
                        <div className="cardapio-item__photo">
                          <img src={p.imagem_url} alt={p.nome} loading="lazy" />
                          {p.prato_da_semana && (
                            <span className="cardapio-item__badge">Prato da semana</span>
                          )}
                        </div>
                      ) : (
                        <div className="cardapio-item__photo cardapio-item__photo--empty" />
                      )}
                      <div className="cardapio-item__body">
                        <div className="cardapio-item__row">
                          <strong>{p.nome}</strong>
                          {p.preco && <span className="cardapio-item__preco">R$ {Number(p.preco).toFixed(2)}</span>}
                        </div>
                        {p.porcao && <span className="cardapio-item__porcao">{p.porcao}</span>}
                        {p.descricao && <p>{p.descricao}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </main>
      <Footer />

      {produtoSelecionado && (
        <QuickViewModal
          produto={produtoSelecionado}
          unidade={active}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
    </>
  )
}

// Pequeno wrapper porque o UnitSwitcher genérico grava no store global, mas
// aqui também precisamos refletir a escolha na URL (?unidade=).
function UnitSwitcherWrapper({ unidades, slugAtivo, onChange }) {
  return (
    <div className="unit-switcher" role="tablist" aria-label="Selecionar unidade">
      {unidades.map((u) => (
        <button
          key={u.slug}
          role="tab"
          aria-selected={slugAtivo === u.slug}
          className={`unit-switcher__btn${slugAtivo === u.slug ? ' unit-switcher__btn--active' : ''}`}
          onClick={() => onChange(u.slug)}
        >
          {u.nome}
        </button>
      ))}
    </div>
  )
}

export default CardapioPage
