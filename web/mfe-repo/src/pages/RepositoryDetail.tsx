import { useParams, Link } from 'react-router-dom'
import { useRepo } from '../hooks/use-repos'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingPage } from '../components/ui/Loading'

export function RepositoryDetail() {
  const { repoName } = useParams<{ repoName: string }>()

  const { data: repo, isLoading } = useRepo(repoName!)

  if (isLoading) return <LoadingPage />
  if (!repo) return <div>Repository not found</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{repo.name}</h1>
        <Link to={`/${repoName}/upload`}>
          <Button>Upload Artifact</Button>
        </Link>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <span className="text-sm text-muted-foreground">Type</span>
              <p className="font-medium">{repo.type}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Format</span>
              <p className="font-medium">{repo.format}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Created</span>
              <p className="font-medium">{new Date(repo.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Artifacts</h3>
          <Link to={`/${repoName}/artifacts`}>
            <Button variant="outline">Browse Artifacts</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
