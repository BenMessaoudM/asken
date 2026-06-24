import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import Home from './pages/Home'
import NewsList from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import EventsList from './pages/EventsList'
import EventDetail from './pages/EventDetail'
import NotFound from './pages/NotFound'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/news', element: <NewsList /> },
  { path: '/news/:slug', element: <NewsDetail /> },
  { path: '/events', element: <EventsList /> },
  { path: '/events/:slug', element: <EventDetail /> },
  { path: '*', element: <NotFound /> }
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>
)
