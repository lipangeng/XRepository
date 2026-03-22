import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTriggerTask } from '../hooks/use-tasks'
import { Card, CardHeader, CardTitle, CardContent } from 'host/components/ui/Card'
import { Button } from 'host/components/ui/Button'

export function TriggerTask() {
  const navigate = useNavigate()
  const triggerTask = useTriggerTask()
  const [type, setType] = useState('sync')
  const [repo, setRepo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await triggerTask.mutateAsync({ type, repo })
    navigate('/')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Trigger Task</h1>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="sync">Sync</option>
                <option value="cleanup">Cleanup</option>
                <option value="rebuild">Rebuild Index</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Repository</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="docker-local"
                required
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={triggerTask.isPending}>
                {triggerTask.isPending ? 'Triggering...' : 'Trigger'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
