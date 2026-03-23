import { useParams } from 'react-router-dom'
import { useTask } from '../hooks/use-tasks'
import { Card } from '../components/ui/Card'
import { LoadingPage } from '../components/ui/Loading'

export function TaskDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: task, isLoading } = useTask(id!)

  if (isLoading) return <LoadingPage />
  if (!task) return <div>Task not found</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Task Details</h1>

      <Card>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <span className="text-sm text-muted-foreground">ID</span>
            <p className="font-medium">{task.id}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Type</span>
            <p className="font-medium">{task.type}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Repository</span>
            <p className="font-medium">{task.repo}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Status</span>
            <p className="font-medium">{task.status}</p>
          </div>
          <div className="col-span-2">
            <span className="text-sm text-muted-foreground">Message</span>
            <p className="font-medium">{task.message}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Created</span>
            <p className="font-medium">{new Date(task.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Updated</span>
            <p className="font-medium">{new Date(task.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
