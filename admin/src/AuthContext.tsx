import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { apiRequest, ApiError } from './api/client'

export interface SessionUser {
  userId: string
  email: string
  name: string
  roles: string[]
  permissions: string[]
}

interface AuthContextType {
  user: SessionUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const result = await apiRequest<{ data: { user: SessionUser } }>('/auth/me')
      setUser(result.data.user)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          const refreshed = await apiRequest<{ data: { user: SessionUser } }>('/auth/refresh', { method: 'POST' }, false)
          setUser(refreshed.data.user)
          return
        } catch {
          setUser(null)
          return
        }
      }
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void refreshSession() }, [refreshSession])

  const login = async (email: string, password: string) => {
    const result = await apiRequest<{ data: { user: SessionUser } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, false)
    setUser(result.data.user)
  }

  const logout = async () => {
    try { await apiRequest('/auth/logout', { method: 'POST' }, false) } finally { setUser(null) }
  }

  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshSession,
    hasPermission: (permission) => Boolean(user?.permissions.includes(permission))
  }), [user, isLoading, refreshSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
