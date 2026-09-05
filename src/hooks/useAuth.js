import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  // unidadeRestritaId: null enquanto não sabemos / usuário sem restrição
  // (super admin). Uma string (uuid) quando o login só pode mexer numa
  // unidade específica.
  const [unidadeRestritaId, setUnidadeRestritaId] = useState(null)
  const [perfilCarregado, setPerfilCarregado] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setUnidadeRestritaId(null)
      setPerfilCarregado(false)
      return
    }
    setPerfilCarregado(false)
    supabase
      .from('perfis_admin')
      .select('unidade_id')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[Tarumã] Erro ao buscar perfil do usuário:', error.message, error)
        }
        setUnidadeRestritaId(data?.unidade_id ?? null)
        setPerfilCarregado(true)
      })
  }, [session])

  async function login(email, password) {
    if (!isSupabaseConfigured) {
      return { error: 'Conecte o Supabase (veja o README) para habilitar o login.' }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message }
  }

  async function logout() {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
  }

  return {
    session,
    loading,
    isAuthenticated: Boolean(session),
    login,
    logout,
    unidadeRestritaId, // null = super admin (vê todas as unidades)
    perfilCarregado,
  }
}
