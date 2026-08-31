import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUnidades } from '../../hooks/useUnidades'
import { useCategorias } from '../../hooks/useCategorias'
import { useAdminProdutos } from '../../hooks/useAdminProdutos'
import { useAdminAvaliacoes } from '../../hooks/useAdminAvaliacoes'
import ProductForm from './ProductForm'
import './Admin.css'

function AdminDashboard() {
  const { logout } = useAuth()
  const { unidades } = useUnidades()
  const { categorias } = useCategorias()
  const [unidadeId, setUnidadeId] = useState(null)
  const [aba, setAba] = useState('produtos')

  const unidadeAtiva = unidadeId ? unidades.find((u) => u.id === unidadeId) : unidades[0]
  const unidadeIdAtiva = unidadeAtiva?.id

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="admin__header-inner">
          <div>
            <span className="eyebrow">Tarumã · Gestão</span>
            <h1>Painel administrativo</h1>
          </div>
          <div className="admin__header-actions">
            <Link to="/" className="btn btn-outline">
              Ver site
            </Link>
            <button className="btn btn-outline" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="admin__body container">
        <div className="admin__toolbar">
          <div className="admin__unit-select">
            <span>Unidade:</span>
            <select value={unidadeIdAtiva || ''} onChange={(e) => setUnidadeId(e.target.value)}>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>

          <nav className="admin__tabs">
            <button
              className={aba === 'produtos' ? 'admin__tab admin__tab--active' : 'admin__tab'}
              onClick={() => setAba('produtos')}
            >
              Cardápio
            </button>
            <button
              className={aba === 'avaliacoes' ? 'admin__tab admin__tab--active' : 'admin__tab'}
              onClick={() => setAba('avaliacoes')}
            >
              Avaliações
            </button>
          </nav>
        </div>

        {aba === 'produtos' && unidadeIdAtiva && (
          <ProdutosPanel unidadeId={unidadeIdAtiva} categorias={categorias} />
        )}
        {aba === 'avaliacoes' && <AvaliacoesPanel />}
      </div>
    </div>
  )
}

function ProdutosPanel({ unidadeId, categorias }) {
  const { produtos, loading, criar, atualizar, excluir } = useAdminProdutos(unidadeId)
  const [editando, setEditando] = useState(null) // null = fechado, {} = novo, {...} = editando
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar(dados) {
    setSalvando(true)
    const resultado = editando?.id ? await atualizar(editando.id, dados) : await criar(dados)
    setSalvando(false)
    if (!resultado.error) setEditando(null)
  }

  async function handleExcluir(produto) {
    if (!window.confirm(`Excluir "${produto.nome}"? Essa ação não pode ser desfeita.`)) return
    await excluir(produto.id)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Cardápio</h2>
        <button className="btn btn-primary" onClick={() => setEditando({})}>
          + Novo prato
        </button>
      </div>

      {editando && (
        <div className="admin-panel__form-box">
          <h3>{editando.id ? 'Editar prato' : 'Novo prato'}</h3>
          <ProductForm
            unidadeId={unidadeId}
            categorias={categorias}
            produtoEditando={editando.id ? editando : null}
            onSalvar={handleSalvar}
            onCancelar={() => setEditando(null)}
            salvando={salvando}
          />
        </div>
      )}

      {loading && <p className="admin-panel__hint">Carregando produtos...</p>}
      {!loading && produtos.length === 0 && (
        <p className="admin-panel__hint">Nenhum prato cadastrado para esta unidade ainda.</p>
      )}

      <div className="admin-table">
        {produtos.map((p) => (
          <div className="admin-table__row" key={p.id}>
            {p.imagem_url ? (
              <img className="admin-table__thumb" src={p.imagem_url} alt={p.nome} />
            ) : (
              <div className="admin-table__thumb admin-table__thumb--empty" />
            )}
            <div className="admin-table__info">
              <strong>{p.nome}</strong>
              <span>{p.categorias?.nome || 'Sem categoria'}</span>
              <div className="admin-table__badges">
                {p.destaque_favorito && <span className="admin-badge">Favorito</span>}
                {p.prato_da_semana && <span className="admin-badge admin-badge--gold">Semana</span>}
                {!p.disponivel && <span className="admin-badge admin-badge--off">Oculto</span>}
              </div>
            </div>
            <div className="admin-table__actions">
              <button className="btn btn-outline" onClick={() => setEditando(p)}>
                Editar
              </button>
              <button className="btn btn-outline admin-table__delete" onClick={() => handleExcluir(p)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AvaliacoesPanel() {
  const { avaliacoes, loading, aprovar, ocultar, excluir } = useAdminAvaliacoes()

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Avaliações</h2>
      </div>

      {loading && <p className="admin-panel__hint">Carregando avaliações...</p>}
      {!loading && avaliacoes.length === 0 && (
        <p className="admin-panel__hint">Nenhuma avaliação recebida ainda.</p>
      )}

      <div className="admin-table">
        {avaliacoes.map((a) => (
          <div className="admin-table__row" key={a.id}>
            <div className="admin-table__info">
              <strong>
                {a.nome_cliente} — {'★'.repeat(a.nota)}
                {'☆'.repeat(5 - a.nota)}
              </strong>
              <span>Prato: {a.produtos?.nome || '—'}</span>
              {a.comentario && <p className="admin-table__comment">{a.comentario}</p>}
              <div className="admin-table__badges">
                <span className={`admin-badge ${a.aprovado ? '' : 'admin-badge--off'}`}>
                  {a.aprovado ? 'Aprovada' : 'Pendente'}
                </span>
              </div>
            </div>
            <div className="admin-table__actions">
              {a.aprovado ? (
                <button className="btn btn-outline" onClick={() => ocultar(a.id)}>
                  Ocultar
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => aprovar(a.id)}>
                  Aprovar
                </button>
              )}
              <button className="btn btn-outline admin-table__delete" onClick={() => excluir(a.id)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
