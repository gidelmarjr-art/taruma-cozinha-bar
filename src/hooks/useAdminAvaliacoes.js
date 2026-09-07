import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useAdminAvaliacoes(unidadeId) {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    if (!isSupabaseConfigured || !unidadeId) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('avaliacoes')
      // `produtos!inner` filtra a tabela de avaliações pelo dado da unidade
      // do produto vinculado — sem isso, vinham avaliações de todas as
      // unidades misturadas, mesmo com uma unidade específica selecionada.
      .select('*, produtos!inner(nome, unidade_id)')
      .eq('produtos.unidade_id', unidadeId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[Tarumã] Erro ao buscar avaliações no admin:', error.message, error)
        }
        setAvaliacoes(error ? [] : data)
        setLoading(false)
      })
  }, [unidadeId])

  useEffect(() => {
    refetch()
  }, [refetch])

  async function aprovar(id) {
    await supabase.from('avaliacoes').update({ aprovado: true }).eq('id', id)
    refetch()
  }

  async function ocultar(id) {
    await supabase.from('avaliacoes').update({ aprovado: false }).eq('id', id)
    refetch()
  }

  async function excluir(id) {
    await supabase.from('avaliacoes').delete().eq('id', id)
    refetch()
  }

  return { avaliacoes, loading, aprovar, ocultar, excluir }
}
