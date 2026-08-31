import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// O site funciona em "modo demonstração" (dados fixos em /src/data/seed.js)
// quando essas variáveis não estão configuradas — assim ele builda e roda
// mesmo antes de existir um projeto Supabase real por trás.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Tarumã] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas — ' +
      'o site está rodando em modo demonstração com dados fixos. ' +
      'Veja o README para conectar o Supabase de verdade.'
  )
}
