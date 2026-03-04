import { useEffect, useState } from 'react'
import { isAdminConfigured, isAdminSession } from '@/services/adminAuth'

type AuthStatus = 'loading' | 'not_configured' | 'unauthenticated' | 'admin'

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
        sessionStorage.setItem('tl_admin_session', '1')
      }
    } catch {
      /* ignore */
    }
  }, [])

  const devBypass =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    (sessionStorage.getItem('tl_admin_session') === '1' ||
      new URLSearchParams(window.location.search).get('devAdmin') === '1')

  if (devBypass) return <>{children}</>

  useEffect(() => {
    const update = () => {
      if (!isAdminConfigured()) {
        setStatus('not_configured')
        return
      }
      setStatus(isAdminSession() ? 'admin' : 'unauthenticated')
    }
    update()
    const onAuthChange = () => update()
    window.addEventListener('tl_admin_login', onAuthChange)
    window.addEventListener('tl_admin_logout', onAuthChange)
    return () => {
      window.removeEventListener('tl_admin_login', onAuthChange)
      window.removeEventListener('tl_admin_logout', onAuthChange)
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#fffde7] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Carregando...</p>
      </div>
    )
  }
  if (status === 'not_configured') return <>{fallbackForbidden}</>
  if (status === 'unauthenticated') return <>{fallbackLogin}</>
  return <>{children}</>
}
