import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { useAdminLocale } from './localization/AdminLocaleContext'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useAdminLocale()
  const location = useLocation()
  if (isLoading) return <main className="p-6">{t.common.loadingSession}</main>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}
