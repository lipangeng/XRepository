import { Routes, Route } from 'react-router-dom'
import { UserManagement } from './pages/UserManagement'
import { SystemSettings } from './pages/SystemSettings'

export function App() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<UserManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="system" element={<SystemSettings />} />
      </Routes>
    </div>
  )
}
