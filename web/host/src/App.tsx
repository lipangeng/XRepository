import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './stores/auth-store'
import { Layout } from './layouts/Layout'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoadingPage } from './components/ui/Loading'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function RepoMFE() {
  const RepoApp = lazy(() => import('mfe-repo/App'))
  return (
    <Suspense fallback={<LoadingPage />}>
      <RepoApp />
    </Suspense>
  )
}

function TaskMFE() {
  const TaskApp = lazy(() => import('mfe-task/App'))
  return (
    <Suspense fallback={<LoadingPage />}>
      <TaskApp />
    </Suspense>
  )
}

function SettingMFE() {
  const SettingApp = lazy(() => import('mfe-setting/App'))
  return (
    <Suspense fallback={<LoadingPage />}>
      <SettingApp />
    </Suspense>
  )
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="repos/*" element={<RepoMFE />} />
        <Route path="tasks/*" element={<TaskMFE />} />
        <Route path="settings/*" element={<SettingMFE />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
