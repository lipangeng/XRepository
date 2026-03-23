import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export function UploadArtifact() {
  const { repoName } = useParams<{ repoName: string }>()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [path, setPath] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !path) return

    setUploading(true)
    try {
      console.log('Uploading:', { repo: repoName, path, file })
      navigate(`/${repoName}`)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Upload Artifact</h1>
      <Card>
        <CardHeader>
          <CardTitle>Artifact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Path</label>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="my-artifact-1.0.0.tar.gz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">File</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <div className="flex gap-4">
              <Button type="submit" disabled={uploading || !file || !path}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/${repoName}`)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
