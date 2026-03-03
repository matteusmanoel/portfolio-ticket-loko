import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isAdmin } from '@/services/firebase'

type AuthStatus = 'loading' | 'unauthenticated' | 'forbidden' | 'admin'

interface AdminGuardProps {
  children: React.ReactNode
  fallbackLogin: React.ReactNode
  fallbackForbidden: React.ReactNode
}

export function AdminGuard({
  children,
  fallbackLogin,
  fallbackForbidden,
}: AdminGuardProps) {
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    if (!import.meta.env.DEV) return
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.get('devAdmin') === '1') {
        localStorage.setItem('tl_dev_admin', '1')
      }
    } catch {
      /* ignore */
    }
  }, [])

  const devBypass =
    import.meta.env.DEV &&
    (typeof window !== 'undefined' &&
      (localStorage.getItem('tl_dev_admin') === '1' ||
        new URLSearchParams(window.location.search).get('devAdmin') === '1'))

  if (devBypass) return <>{children}</>

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('unauthenticated')
        return
      }
      const admin = await isAdmin(user.uid)
      setStatus(admin ? 'admin' : 'forbidden')
    })
    return unsub
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#fffde7] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Carregando...</p>
      </div>
    )
  }
  if (status === 'unauthenticated') return <>{fallbackLogin}</>
  if (status === 'forbidden') return <>{fallbackForbidden}</>
  return <>{children}</>
}
