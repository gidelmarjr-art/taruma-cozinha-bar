import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useAvaliacoes(produtoId) {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [loading, setLoading] = useState(Boolean(produtoId) && isSupabaseConfigured)

  const refetch = useCallback(() => {
    if (!produtoId || !isSupabaseConfigured) return
    setLoading(true)
    supabase
      .from('avaliacoes')
      .select('*')
      .eq('produto_id', produtoId)
      .eq('aprovado', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[Tarumã] Erro ao buscar avaliações:', error.message, error)
        }
        setAvaliacoes(error ? [] : data)
        setLoading(false)
      })
  }, [produtoId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { avaliacoes, loading, refetch }
}

/**
 * Envia uma nova avaliação — publica na hora, sem precisar de aprovação
 * da gerência (o admin pode ocultar depois, se precisar).
 * Retorna { success, error }.
 */
export async function enviarAvaliacao({ produtoId, nomeCliente, nota, comentario }) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Avaliações exigem o Supabase conectado.' }
  }
  const { error } = await supabase.from('avaliacoes').insert({
    produto_id: produtoId,
    nome_cliente: nomeCliente,
    nota,
    comentario,
  })
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[Tarumã] Erro ao enviar avaliação:', error.message, error)
  }
  return { success: !error, error: error?.message }
}
