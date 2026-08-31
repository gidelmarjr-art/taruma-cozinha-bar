import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'
import './Admin.css'

function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: loginError } = await login(email, password)
    setLoading(false)
    if (loginError) {
      setError(loginError)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth__box">
        <Link to="/" className="admin-auth__back">
          ← Voltar ao site
        </Link>
        <span className="eyebrow">Tarumã · Gestão</span>
        <h1>Entrar no painel</h1>
        <p className="admin-auth__hint">Acesso restrito à gerência do Tarumã.</p>

        {!isSupabaseConfigured && (
          <p className="admin-auth__warning">
            Supabase não configurado — o login está desabilitado neste ambiente. Veja o README.
          </p>
        )}

        <form onSubmit={handleSubmit} className="admin-auth__form">
          <label>
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isSupabaseConfigured}
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isSupabaseConfigured}
            />
          </label>

          {error && <p className="admin-auth__error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading || !isSupabaseConfigured}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
