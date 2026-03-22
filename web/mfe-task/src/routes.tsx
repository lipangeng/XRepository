import { Routes, Route } from 'react-router-dom'
import { TaskList } from './pages/TaskList'
import { TaskDetail } from './pages/TaskDetail'
import { TriggerTask } from './pages/TriggerTask'

export function TaskRoutes() {
  return (
    <Routes>
      <Route index element={<TaskList />} />
      <Route path="trigger" element={<TriggerTask />} />
      <Route path=":id" element={<TaskDetail />} />
    </Routes>
  )
}
