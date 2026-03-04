/**
 * Autenticação simples do admin via credenciais definidas em .env.
 * Use VITE_ADMIN_USER e VITE_ADMIN_PASSWORD no .env.
 */

const SESSION_KEY = 'tl_admin_session'

function getCredentials(): { user: string; password: string } | null {
  const user = import.meta.env.VITE_ADMIN_USER as string | undefined
  const password = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined
  if (!user?.trim() || !password) return null
  return { user: user.trim(), password }
}

export function isAdminConfigured(): boolean {
  return getCredentials() !== null
}

export function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

export function login(username: string, password: string): boolean {
  const creds = getCredentials()
  if (!creds) return false
  const ok =
    username.trim() === creds.user && password === creds.password
  if (ok && typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, '1')
    window.dispatchEvent(new CustomEvent('tl_admin_login'))
  }
  return ok
}

export function logout(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new CustomEvent('tl_admin_logout'))
}
