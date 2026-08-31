import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { seedProdutos, seedCategorias } from '../data/seed'

function withCategoria(produto) {
  const categoria = seedCategorias.find((c) => c.id === produto.categoria_id)
  return { ...produto, categorias: categoria ? { nome: categoria.nome, slug: categoria.slug } : null }
}

/**
 * Busca os produtos (cardápio) de uma unidade.
 * @param {string} unidadeId
 * @param {{ apenasFavoritos?: boolean }} options
 */
export function useProdutos(unidadeId, { apenasFavoritos = false } = {}) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!unidadeId) return
    let active = true
    setLoading(true)

    if (!isSupabaseConfigured) {
      const filtrados = seedProdutos
        .filter((p) => p.unidade_id === unidadeId && (!apenasFavoritos || p.destaque_favorito))
        .map(withCategoria)
      setProdutos(filtrados)
      setLoading(false)
      return
    }

    let query = supabase
      .from('produtos')
      .select('*, categorias(nome, slug)')
      .eq('unidade_id', unidadeId)
      .eq('disponivel', true)

    if (apenasFavoritos) {
      query = query.eq('destaque_favorito', true)
    }

    query.then(({ data, error }) => {
      if (!active) return
      if (error) {
        setProdutos(seedProdutos.filter((p) => p.unidade_id === unidadeId).map(withCategoria))
      } else {
        setProdutos(data)
      }
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [unidadeId, apenasFavoritos])

  return { produtos, loading }
}
