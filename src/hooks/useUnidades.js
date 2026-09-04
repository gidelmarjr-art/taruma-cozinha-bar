import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { seedUnidades } from '../data/seed'

export function useUnidades() {
  const [unidades, setUnidades] = useState(isSupabaseConfigured ? [] : seedUnidades)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    setLoading(true)

    supabase
      .from('unidades')
      .select('*')
      .order('nome', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (!active) return
        if (fetchError) {
          // eslint-disable-next-line no-console
          console.error('[Tarumã] Erro ao buscar unidades no Supabase:', fetchError.message, fetchError)
          setError(fetchError)
          setUnidades(seedUnidades) // nunca deixa a página sem nenhuma unidade pra navegar
        } else {
          setUnidades(data)
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { unidades, loading, error }
}
