import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import i18n from './i18n'
import About from './pages/About'
import Tutoring from './pages/Tutoring'
import StudentCouncil from './pages/StudentCouncil'
import EldersCouncil from './pages/EldersCouncil'
import OrganizationPeople from './pages/OrganizationPeople'
import Organization from './pages/Organization'
import GetInvolved from './pages/GetInvolved'
import Committees from './pages/Committees'
import Alumni from './pages/Alumni'
import Accessibility from './pages/Accessibility'
import Associations from './pages/Associations'
import Board from './pages/Board'
import Booking from './pages/Booking'
import BookingStatus from './pages/BookingStatus'
import Contact from './pages/Contact'
import CorHouse from './pages/CorHouse'
import EventDetail from './pages/EventDetail'
import EventsList from './pages/EventsList'
import Home from './pages/Home'
import Membership from './pages/Membership'
import NewsDetail from './pages/NewsDetail'
import NewsList from './pages/NewsList'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/organisation', element: <Organization /> },
  { path: '/organisation/styrelsen', element: <OrganizationPeople type="board" /> },
  { path: '/organisation/personal', element: <OrganizationPeople type="staff" /> },
  { path: '/organisation/kommitteer', element: <Committees /> },
  { path: '/organisation/fullmaktige', element: <StudentCouncil /> },
  { path: '/organisation/aldres-rad', element: <EldersCouncil /> },
  { path: '/organisation/tutoring', element: <Tutoring /> },
  { path: '/organisation/engagera-dig', element: <GetInvolved /> },
  { path: '/organisation/alumner', element: <Alumni /> },
  { path: '/alumner', element: <Alumni /> },
  { path: '/board', element: <Board /> },
  { path: '/membership', element: <Membership /> },
  { path: '/contact', element: <Contact /> },
  { path: '/associations', element: <Associations /> },
  { path: '/cor-house', element: <CorHouse /> },
  { path: '/booking', element: <Booking /> },
  { path: '/booking/status', element: <BookingStatus /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/accessibility', element: <Accessibility /> },
  { path: '/news', element: <NewsList /> },
  { path: '/news/:slug', element: <NewsDetail /> },
  { path: '/events', element: <EventsList /> },
  { path: '/events/:slug', element: <EventDetail /> },
  { path: '*', element: <NotFound /> },
])

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><I18nextProvider i18n={i18n}><QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider></I18nextProvider></React.StrictMode>,
)
