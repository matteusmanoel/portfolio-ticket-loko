import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signOut } from '@/services/firebase'

export function AdminForbidden() {
  const [loading, setLoading] = useState(false)

  const handleTrocarConta = async () => {
    setLoading(true)
    try {
      await signOut()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fffde7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-8 max-w-sm w-full text-center">
        <h1 className="font-black text-amber-700 uppercase text-lg mb-2">
          Sem permissão
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Sua conta não tem acesso de administrador. Troque de conta para entrar com um admin.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleTrocarConta}
            disabled={loading}
            className="w-full bg-brand-red text-white py-3 rounded-2xl font-bold disabled:opacity-50 hover:bg-brand-red-hover"
          >
            {loading ? 'Saindo...' : 'Trocar conta'}
          </button>
          <Link
            to="/"
            className="block w-full bg-gray-800 text-white py-3 rounded-2xl font-bold"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
