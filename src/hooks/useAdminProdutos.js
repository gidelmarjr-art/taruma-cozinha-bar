import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useAdminProdutos(unidadeId) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(() => {
    if (!isSupabaseConfigured || !unidadeId) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('produtos')
      .select('*, categorias(nome, slug)')
      .eq('unidade_id', unidadeId)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        setError(fetchError?.message || null)
        setProdutos(data || [])
        setLoading(false)
      })
  }, [unidadeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  async function criar(produto) {
    const { error: insertError } = await supabase.from('produtos').insert(produto)
    if (!insertError) refetch()
    return { error: insertError?.message }
  }

  async function atualizar(id, alteracoes) {
    const { error: updateError } = await supabase.from('produtos').update(alteracoes).eq('id', id)
    if (!updateError) refetch()
    return { error: updateError?.message }
  }

  async function excluir(id) {
    const { error: deleteError } = await supabase.from('produtos').delete().eq('id', id)
    if (!deleteError) refetch()
    return { error: deleteError?.message }
  }

  return { produtos, loading, error, criar, atualizar, excluir, refetch }
}
