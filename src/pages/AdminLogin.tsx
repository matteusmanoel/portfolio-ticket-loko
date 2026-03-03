import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithGoogle, signInWithEmailPassword } from '@/services/firebase'

interface AdminLoginProps {
  onSuccess?: () => void
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
      onSuccess?.()
      navigate('/admin')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailPassword(email.trim(), password)
      onSuccess?.()
      navigate('/admin')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fffde7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-brand-red p-8 max-w-sm w-full text-center">
        <h1 className="font-black text-brand-red uppercase italic text-xl mb-2">
          Admin Ticket Loko
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Entre com sua conta para gerenciar o catálogo.
        </p>
        {error && (
          <p className="text-red-700 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>
        )}
        <form onSubmit={handleEmailPassword} className="space-y-3 mb-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none text-sm"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-red focus:outline-none text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white py-3 rounded-2xl font-bold disabled:opacity-50 hover:bg-brand-red-hover"
          >
            {loading ? 'Entrando...' : 'Entrar com e-mail'}
          </button>
        </form>
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  )
}
