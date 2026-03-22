import { Routes, Route } from 'react-router-dom'
import { RepositoryList } from './pages/RepositoryList'
import { RepositoryDetail } from './pages/RepositoryDetail'
import { CreateRepository } from './pages/CreateRepository'
import { ArtifactBrowser } from './pages/ArtifactBrowser'
import { UploadArtifact } from './pages/UploadArtifact'

export function App() {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<RepositoryList />} />
        <Route path="new" element={<CreateRepository />} />
        <Route path=":repoName" element={<RepositoryDetail />} />
        <Route path=":repoName/artifacts/*" element={<ArtifactBrowser />} />
        <Route path=":repoName/upload" element={<UploadArtifact />} />
      </Routes>
    </div>
  )
}
