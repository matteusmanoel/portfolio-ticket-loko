import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ensureAnonymousAuth } from '@/services/firebase'
import { getVendorFromQuery, setStoredVendor } from '@/features/vendor/vendorFromQuery'
import { CatalogPage } from '@/pages/CatalogPage'
import { AdminPage } from '@/pages/AdminPage'
import { AdminLogin } from '@/pages/AdminLogin'
import { AdminForbidden } from '@/pages/AdminForbidden'
import { AdminGuard } from '@/components/AdminGuard'

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
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route
          path="/admin"
          element={
            <AdminGuard
              fallbackLogin={<AdminLogin />}
              fallbackForbidden={<AdminForbidden />}
            >
              <AdminPage />
            </AdminGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
