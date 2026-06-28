import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { AdminLocaleProvider } from './localization/AdminLocaleContext'
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
import NewsDashboard from './pages/NewsDashboard'
import NewsEditor from './pages/NewsEditor'
import EventsDashboard from './pages/EventsDashboard'
import BookingDashboard from './pages/BookingDashboard'
import BookingEditor from './pages/BookingEditor'
import BookingResourceEditor from './pages/BookingResourceEditor'
import EventEditor from './pages/EventEditor'
import ModulePlaceholder from './pages/ModulePlaceholder'
import OrganizationDashboard from './pages/OrganizationDashboard'
import RepresentativesDashboard from './pages/RepresentativesDashboard'
import GovernanceDashboard from './pages/GovernanceDashboard'
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
      { path: '/news', element: protectedPage('/news', <NewsDashboard />) },
      { path: '/news/new', element: <PermissionGuard permission="news.write"><NewsEditor /></PermissionGuard> },
      { path: '/news/:articleId', element: protectedPage('/news', <NewsEditor />) },
      { path: '/events', element: protectedPage('/events', <EventsDashboard />) },
      { path: '/events/new', element: <PermissionGuard permission="events.write"><EventEditor /></PermissionGuard> },
      { path: '/events/:id', element: protectedPage('/events', <EventEditor />) },
      { path: '/cor-activities', element: placeholder('/cor-activities') },
      { path: '/collaborations', element: placeholder('/collaborations') },
      { path: '/booking', element: protectedPage('/booking', <BookingDashboard />) },
      { path: '/booking/resources/new', element: <PermissionGuard permission="booking.write"><BookingResourceEditor /></PermissionGuard> },
      { path: '/booking/resources/:id', element: <PermissionGuard permission="booking.write"><BookingResourceEditor /></PermissionGuard> },
      { path: '/booking/:id', element: protectedPage('/booking', <BookingEditor />) },
      { path: '/organization', element: protectedPage('/organization', <OrganizationDashboard />) },
      { path: '/representatives', element: protectedPage('/representatives', <RepresentativesDashboard />) },
      { path: '/governance', element: protectedPage('/governance', <GovernanceDashboard />) },
      { path: '/settings', element: placeholder('/settings') },
      { path: '/change-password', element: <ChangePassword /> },
      { path: '/forbidden', element: <Forbidden /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AdminLocaleProvider><AuthProvider><RouterProvider router={router} /></AuthProvider></AdminLocaleProvider></React.StrictMode>
)
