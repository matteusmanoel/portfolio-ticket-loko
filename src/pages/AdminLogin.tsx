import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAdminConfigured } from '@/services/adminAuth'

interface AdminLoginProps {
  onSuccess?: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    setLoading(true)
    setError(null)
    const ok = login(username.trim(), password)
    if (ok) {
      onSuccess?.()
      navigate('/admin')
    } else {
      setError('Usuário ou senha incorretos.')
    }
    setLoading(false)
  }

  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#fffde7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-8 max-w-sm w-full text-center">
          <h1 className="font-black text-amber-700 uppercase text-lg mb-2">
            Admin não configurado
          </h1>
          <p className="text-sm text-gray-500">
            Defina <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_USER</code> e{' '}
            <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_PASSWORD</code> no arquivo .env
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffde7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-brand-red p-8 max-w-sm w-full text-center">
        <h1 className="font-black text-brand-red uppercase italic text-xl mb-2">
          Admin Ticket Loko
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Entre com usuário e senha para gerenciar o catálogo.
        </p>
        {error && (
          <p className="text-red-700 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none text-sm"
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none text-sm"
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white py-3 rounded-2xl font-bold disabled:opacity-50 hover:bg-brand-red-hover"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
