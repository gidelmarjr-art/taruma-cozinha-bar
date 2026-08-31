import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { seedCategorias } from '../data/seed'

export function useCategorias() {
  const [categorias, setCategorias] = useState(isSupabaseConfigured ? [] : seedCategorias)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    setLoading(true)

    supabase
      .from('categorias')
      .select('*')
      .order('ordem', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        setCategorias(error ? seedCategorias : data)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { categorias, loading }
}
