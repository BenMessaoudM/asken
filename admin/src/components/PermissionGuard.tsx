import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function PermissionGuard({ permission, children }: { permission: string; children: ReactNode }) {
  const { hasPermission } = useAuth()
  if (!hasPermission(permission)) return <Navigate to="/forbidden" replace />
  return <>{children}</>
}
