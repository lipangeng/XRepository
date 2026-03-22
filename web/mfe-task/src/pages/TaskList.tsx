import { Link } from 'react-router-dom'
import { useTasks } from '../hooks/use-tasks'
import { Card } from 'host/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from 'host/components/ui/Table'
import { Button } from 'host/components/ui/Button'
import { LoadingPage } from 'host/components/ui/Loading'

export function TaskList() {
  const { data: tasks, isLoading } = useTasks()

  if (isLoading) return <LoadingPage />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to="/trigger">
          <Button>Trigger Task</Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Repo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Link to={`/${task.id}`} className="text-primary hover:underline">
                    {task.id.slice(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.repo}</TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>{task.message}</TableCell>
                <TableCell>{new Date(task.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {tasks?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No tasks found</div>
        )}
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  )
}
