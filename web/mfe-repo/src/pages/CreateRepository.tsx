import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'host/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from 'host/components/ui/Card'
import { useCreateRepo } from '../hooks/use-repos'

export function CreateRepository() {
  const navigate = useNavigate()
  const createRepo = useCreateRepo()
  const [name, setName] = useState('')
  const [type, setType] = useState<'hosted' | 'proxy' | 'group'>('hosted')
  const [format, setFormat] = useState<'docker' | 'helm' | 'maven'>('docker')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRepo.mutateAsync({ name, type, format })
      navigate('/')
    } catch (err: any) {
      console.error('Failed to create repo:', err)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create Repository</h1>
      <Card>
        <CardHeader>
          <CardTitle>Repository Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="my-repo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="hosted">Hosted</option>
                <option value="proxy">Proxy</option>
                <option value="group">Group</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="docker">Docker</option>
                <option value="helm">Helm</option>
                <option value="maven">Maven</option>
              </select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={createRepo.isPending}>
                {createRepo.isPending ? 'Creating...' : 'Create'}
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
