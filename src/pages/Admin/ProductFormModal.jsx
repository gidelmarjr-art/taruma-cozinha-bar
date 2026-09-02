import { useEffect, useState } from 'react'
import { uploadImagemProduto } from '../../hooks/useProdutoImagem'
import './Admin.css'

const VAZIO = {
  nome: '',
  descricao: '',
  preco: '',
  porcao: '',
  categoria_id: '',
  imagem_url: '',
  destaque_favorito: false,
  prato_da_semana: false,
  disponivel: true,
}

function ProductFormModal({ unidadeNome, categorias, produtoEditando, onSalvar, onCancelar, salvando }) {
  const [form, setForm] = useState(produtoEditando ? { ...VAZIO, ...produtoEditando } : VAZIO)
  const [imagemTab, setImagemTab] = useState('upload')
  const [enviandoImagem, setEnviandoImagem] = useState(false)
  const [erroImagem, setErroImagem] = useState(null)

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancelar()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onCancelar])

  async function handleImagemArquivo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setEnviandoImagem(true)
    setErroImagem(null)
    const { url, error } = await uploadImagemProduto(file)
    setEnviandoImagem(false)
    if (error) {
      setErroImagem(error)
    } else {
      setForm((f) => ({ ...f, imagem_url: url }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar({
      ...form,
      preco: form.preco ? Number(form.preco) : null,
      categoria_id: form.categoria_id || null,
    })
  }

  return (
    <div className="admin-modal__backdrop" onClick={onCancelar}>
      <div className="admin-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal__close" onClick={onCancelar} aria-label="Fechar">
          ✕
        </button>

        <header className="admin-modal__header">
          <div className="admin-modal__icon">🍽️</div>
          <div>
            <h2>{produtoEditando ? 'Editar prato' : 'Novo prato'}</h2>
            <p>
              {produtoEditando
                ? `Atualize as informações 🔥 unidade ${unidadeNome}.`
                : `Adicione um prato ao cardápio da unidade ${unidadeNome}.`}
            </p>
          </div>
        </header>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Nome do prato
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
          </label>

          <label>
            Descrição
            <textarea
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            />
          </label>

          <div className="admin-form__row">
            <label>
              Categoria
              <select
                value={form.categoria_id || ''}
                onChange={(e) => setForm((f) => ({ ...f, categoria_id: e.target.value }))}
              >
                <option value="">Sem categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Preço (R$)
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.preco || ''}
                onChange={(e) => setForm((f) => ({ ...f, preco: e.target.value }))}
              />
            </label>
          </div>

          <label>
            Porção
            <input
              type="text"
              placeholder='ex: "Serve 2 pessoas"'
              value={form.porcao || ''}
              onChange={(e) => setForm((f) => ({ ...f, porcao: e.target.value }))}
            />
          </label>

          <div className="admin-form__image">
            <span className="admin-form__image-label">Foto do prato</span>
            <div className="admin-form__image-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={imagemTab === 'upload'}
                className={`admin-form__image-tab${imagemTab === 'upload' ? ' admin-form__image-tab--active' : ''}`}
                onClick={() => setImagemTab('upload')}
              >
                Enviar arquivo
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={imagemTab === 'url'}
                className={`admin-form__image-tab${imagemTab === 'url' ? ' admin-form__image-tab--active' : ''}`}
                onClick={() => setImagemTab('url')}
              >
                Link da imagem
              </button>
            </div>

            <div className="admin-form__image-body">
              {imagemTab === 'upload' ? (
                <>
                  <input type="file" accept="image/*" onChange={handleImagemArquivo} />
                  {enviandoImagem && <p className="admin-form__hint">Enviando imagem...</p>}
                  {erroImagem && <p className="admin-form__error">{erroImagem}</p>}
                </>
              ) : (
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.imagem_url || ''}
                  onChange={(e) => setForm((f) => ({ ...f, imagem_url: e.target.value }))}
                />
              )}

              {form.imagem_url && (
                <img className="admin-form__preview" src={form.imagem_url} alt="Pré-visualização" />
              )}
            </div>
          </div>

          <div className="admin-form__toggles">
            <label className={`admin-form__chip${form.destaque_favorito ? ' admin-form__chip--active' : ''}`}>
              <input
                type="checkbox"
                checked={form.destaque_favorito}
                onChange={(e) => setForm((f) => ({ ...f, destaque_favorito: e.target.checked }))}
              />
              Favorito da casa
            </label>
            <label className={`admin-form__chip${form.prato_da_semana ? ' admin-form__chip--active admin-form__chip--gold' : ''}`}>
              <input
                type="checkbox"
                checked={form.prato_da_semana}
                onChange={(e) => setForm((f) => ({ ...f, prato_da_semana: e.target.checked }))}
              />
              Prato da semana
            </label>
            <label className={`admin-form__chip${form.disponivel ? ' admin-form__chip--active' : ''}`}>
              <input
                type="checkbox"
                checked={form.disponivel}
                onChange={(e) => setForm((f) => ({ ...f, disponivel: e.target.checked }))}
              />
              Disponível no site
            </label>
          </div>

          <div className="admin-form__actions">
            <button className="btn btn-primary" type="submit" disabled={salvando || enviandoImagem}>
              {salvando ? 'Salvando...' : 'Salvar prato'}
            </button>
            <button className="btn btn-outline" type="button" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
