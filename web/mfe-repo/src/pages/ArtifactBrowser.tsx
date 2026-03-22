import { useParams } from 'react-router-dom'
import { Card } from 'host/components/ui/Card'
import { Table, TableBody, TableRow, TableCell, TableHead } from 'host/components/ui/Table'
import { Button } from 'host/components/ui/Button'

export function ArtifactBrowser() {
  const { repoName } = useParams<{ repoName: string }>()

  const artifacts = [
    { path: 'artifact-1.0.0.tar.gz', size: 1024 * 1024, createdAt: new Date().toISOString() },
    { path: 'artifact-2.0.0.tar.gz', size: 2 * 1024 * 1024, createdAt: new Date().toISOString() },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Artifacts - {repoName}</h1>

      <Card>
        <Table>
          <thead>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </thead>
          <TableBody>
            {artifacts.map((artifact) => (
              <TableRow key={artifact.path}>
                <TableCell>{artifact.path}</TableCell>
                <TableCell>{(artifact.size / 1024).toFixed(2)} KB</TableCell>
                <TableCell>{new Date(artifact.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
