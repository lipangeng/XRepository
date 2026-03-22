import { Link } from 'react-router-dom'
import { useRepos, useDeleteRepo } from '../hooks/use-repos'
import { Button } from 'host/components/ui/Button'
import { Card } from 'host/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from 'host/components/ui/Table'
import { LoadingPage } from 'host/components/ui/Loading'

export function RepositoryList() {
  const { data: repos, isLoading, error } = useRepos()
  const deleteRepo = useDeleteRepo()

  if (isLoading) return <LoadingPage />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Repositories</h1>
        <Link to="/new">
          <Button>Create Repository</Button>
        </Link>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repos?.map((repo) => (
              <TableRow key={repo.name}>
                <TableCell>
                  <Link to={`/${repo.name}`} className="text-primary hover:underline">
                    {repo.name}
                  </Link>
                </TableCell>
                <TableCell>{repo.type}</TableCell>
                <TableCell>{repo.format}</TableCell>
                <TableCell>{new Date(repo.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteRepo.mutate(repo.name)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {repos?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No repositories found</div>
        )}
      </Card>
    </div>
  )
}
