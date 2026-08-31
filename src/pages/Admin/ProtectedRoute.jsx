import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-blocked">
        <div className="admin-blocked__box">
          <span className="eyebrow">Painel administrativo</span>
          <h2>Supabase ainda não conectado</h2>
          <p>
            O login e o painel de gestão só funcionam com o banco conectado.
            Veja o README (seção "Conectar o Supabase") para configurar
            <code> VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="admin-blocked">
        <div className="admin-blocked__box">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
