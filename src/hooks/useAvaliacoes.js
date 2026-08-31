import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useAvaliacoes(produtoId) {
  const [avaliacoes, setAvaliacoes] = useState([])
  const [loading, setLoading] = useState(Boolean(produtoId) && isSupabaseConfigured)

  useEffect(() => {
    if (!produtoId || !isSupabaseConfigured) return
    let active = true
    setLoading(true)

    supabase
      .from('avaliacoes')
      .select('*')
      .eq('produto_id', produtoId)
      .eq('aprovado', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        setAvaliacoes(error ? [] : data)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [produtoId])

  return { avaliacoes, loading }
}

/**
 * Envia uma nova avaliação (fica pendente até a gerência aprovar no admin).
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
  return { success: !error, error: error?.message }
}
