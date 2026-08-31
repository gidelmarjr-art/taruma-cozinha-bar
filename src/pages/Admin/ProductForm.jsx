import { useState } from 'react'
import { uploadImagemProduto } from '../../hooks/useProdutoImagem'

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

function ProductForm({ unidadeId, categorias, produtoEditando, onSalvar, onCancelar, salvando }) {
  const [form, setForm] = useState(produtoEditando ? { ...VAZIO, ...produtoEditando } : VAZIO)
  const [enviandoImagem, setEnviandoImagem] = useState(false)
  const [erroImagem, setErroImagem] = useState(null)

  async function handleImagem(e) {
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
      unidade_id: unidadeId,
      preco: form.preco ? Number(form.preco) : null,
      categoria_id: form.categoria_id || null,
    })
  }

  return (
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

      <label>
        Foto do prato
        <input type="file" accept="image/*" onChange={handleImagem} />
      </label>
      {enviandoImagem && <p className="admin-form__hint">Enviando imagem...</p>}
      {erroImagem && <p className="admin-form__error">{erroImagem}</p>}
      {form.imagem_url && (
        <img className="admin-form__preview" src={form.imagem_url} alt="Pré-visualização" />
      )}

      <div className="admin-form__toggles">
        <label className="admin-form__toggle">
          <input
            type="checkbox"
            checked={form.destaque_favorito}
            onChange={(e) => setForm((f) => ({ ...f, destaque_favorito: e.target.checked }))}
          />
          Favorito da casa
        </label>
        <label className="admin-form__toggle">
          <input
            type="checkbox"
            checked={form.prato_da_semana}
            onChange={(e) => setForm((f) => ({ ...f, prato_da_semana: e.target.checked }))}
          />
          Prato da semana
        </label>
        <label className="admin-form__toggle">
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
  )
}

export default ProductForm
