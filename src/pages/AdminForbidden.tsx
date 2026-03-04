import { Link } from 'react-router-dom'

export function AdminForbidden() {
  return (
    <div className="min-h-screen bg-[#fffde7] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-8 max-w-sm w-full text-center">
        <h1 className="font-black text-amber-700 uppercase text-lg mb-2">
          Admin não configurado
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Defina <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_USER</code> e{' '}
          <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_PASSWORD</code> no arquivo .env para acessar o painel.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="block w-full bg-brand-red text-white py-3 rounded-2xl font-bold text-center hover:bg-brand-red-hover"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
