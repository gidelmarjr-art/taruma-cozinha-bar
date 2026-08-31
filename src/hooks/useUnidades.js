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
          setError(fetchError)
          setUnidades(seedUnidades) // nunca deixa a página quebrada por erro de rede
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
