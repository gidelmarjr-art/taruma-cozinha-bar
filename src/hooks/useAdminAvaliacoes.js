import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useAdminAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('avaliacoes')
      .select('*, produtos(nome)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setAvaliacoes(data || [])
        setLoading(false)
      })
  }, [])

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
