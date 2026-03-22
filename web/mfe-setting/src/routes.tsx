import { Routes, Route } from 'react-router-dom'
import { UserManagement } from './pages/UserManagement'
import { SystemSettings } from './pages/SystemSettings'

export function SettingRoutes() {
  return (
    <Routes>
      <Route index element={<UserManagement />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="system" element={<SystemSettings />} />
    </Routes>
  )
}
