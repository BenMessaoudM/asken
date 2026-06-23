import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import RequireAuth from './RequireAuth'
import AdminLayout from './components/AdminLayout'
import PermissionGuard from './components/PermissionGuard'
import { dashboardModules } from './dashboard/navigation'
import ChangePassword from './pages/ChangePassword'
import ContentPages from './pages/ContentPages'
import ContentEditor from './pages/ContentEditor'
import Forbidden from './pages/Forbidden'
import Login from './pages/Login'
import Management from './pages/Management'
import ModulePlaceholder from './pages/ModulePlaceholder'
import Roles from './pages/Roles'
import Users from './pages/Users'
import './index.css'

const moduleByPath = new Map(dashboardModules.map((module) => [module.path, module]))
const protectedPage = (path: string, element: React.ReactNode) => {
  const module = moduleByPath.get(path)
  if (!module) throw new Error(`Missing dashboard module for ${path}`)
  return <PermissionGuard permission={module.permission}>{element}</PermissionGuard>
}
const placeholder = (path: string) => {
  const module = moduleByPath.get(path)
  if (!module) throw new Error(`Missing dashboard module for ${path}`)
  return protectedPage(path, <ModulePlaceholder module={module} />)
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    element: <RequireAuth><AdminLayout /></RequireAuth>,
    children: [
      { path: '/', element: protectedPage('/', <Management />) },
      { path: '/users', element: protectedPage('/users', <Users />) },
      { path: '/roles', element: protectedPage('/roles', <Roles />) },
      { path: '/content', element: protectedPage('/content', <ContentPages />) },
      { path: '/content/new', element: <PermissionGuard permission="content.write"><ContentEditor /></PermissionGuard> },
      { path: '/content/:contentId', element: protectedPage('/content', <ContentEditor />) },
      { path: '/news', element: placeholder('/news') },
      { path: '/events', element: placeholder('/events') },
      { path: '/cor-activities', element: placeholder('/cor-activities') },
      { path: '/collaborations', element: placeholder('/collaborations') },
      { path: '/booking', element: placeholder('/booking') },
      { path: '/governance', element: placeholder('/governance') },
      { path: '/settings', element: placeholder('/settings') },
      { path: '/change-password', element: <ChangePassword /> },
      { path: '/forbidden', element: <Forbidden /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AuthProvider><RouterProvider router={router} /></AuthProvider></React.StrictMode>
)
