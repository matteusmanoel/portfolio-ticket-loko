import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ensureAnonymousAuth } from '@/services/firebase'
import { getVendorFromQuery, setStoredVendor } from '@/features/vendor/vendorFromQuery'
import { CatalogPage } from '@/pages/CatalogPage'
import { AdminPage } from '@/pages/AdminPage'
import { AdminLogin } from '@/pages/AdminLogin'
import { AdminForbidden } from '@/pages/AdminForbidden'
import { AdminGuard } from '@/components/AdminGuard'

const ADMIN_BG = '#f3f4f6'
const DEFAULT_BG = '#2b0006'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    const isAdmin = location.pathname === '/admin'
    const bg = isAdmin ? ADMIN_BG : DEFAULT_BG
    document.documentElement.style.backgroundColor = bg
    document.body.style.backgroundColor = bg
  }, [location.pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route
          path="/admin"
          element={
            <div className="min-h-screen bg-gray-100">
              <AdminGuard
                fallbackLogin={<AdminLogin />}
                fallbackForbidden={<AdminForbidden />}
              >
                <AdminPage />
              </AdminGuard>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export function App() {
  useEffect(() => {
    ensureAnonymousAuth().catch(console.error)
  }, [])

  useEffect(() => {
    const fromUrl = getVendorFromQuery()
    if (fromUrl?.isValid) {
      setStoredVendor(fromUrl)
      const params = new URLSearchParams(window.location.search)
      params.delete('wpp')
      params.delete('v')
      const q = params.toString()
      const cleanUrl = window.location.pathname + (q ? `?${q}` : '')
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [])

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
