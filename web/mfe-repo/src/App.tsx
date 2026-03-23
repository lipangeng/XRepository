import { Routes, Route } from 'react-router-dom'
import { RepositoryList } from './pages/RepositoryList'
import { RepositoryDetail } from './pages/RepositoryDetail'
import { CreateRepository } from './pages/CreateRepository'
import { ArtifactBrowser } from './pages/ArtifactBrowser'
import { UploadArtifact } from './pages/UploadArtifact'

// MFE Repo App - 被 Host 动态加载
// 路由由 Host 管理，这里只定义组件内部的路由
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
