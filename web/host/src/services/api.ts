import { api } from '../stores/auth-store'
import type {
  User,
  Repository,
  Artifact,
  Task,
  LoginRequest,
  LoginResponse,
  CreateRepoRequest,
  TriggerTaskRequest,
} from '../types'

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/auth/login', data).then((res) => res.data),

  me: (): Promise<User> => api.get('/auth/me').then((res) => res.data),
}

export const repoApi = {
  list: (): Promise<Repository[]> => api.get('/repos').then((res) => res.data),
  create: (data: CreateRepoRequest): Promise<Repository> =>
    api.post('/repos', data).then((res) => res.data),
  get: (name: string): Promise<Repository> =>
    api.get(`/repos/${name}`).then((res) => res.data),
  delete: (name: string): Promise<void> => api.delete(`/repos/${name}`).then(() => {}),
}

export const artifactApi = {
  upload: (repo: string, path: string, file: Blob): Promise<Artifact> => {
    return api
      .post(`/api/repos/${repo}/artifacts/${path}`, file, {
        headers: { 'Content-Type': 'application/octet-stream' },
      })
      .then((res) => res.data)
  },
  download: (repo: string, path: string): Promise<Blob> =>
    api.get(`/api/repos/${repo}/artifacts/${path}`, {
      responseType: 'blob',
    }).then((res) => res.data),
}

export const taskApi = {
  list: (): Promise<Task[]> => api.get('/tasks').then((res) => res.data),
  trigger: (data: TriggerTaskRequest): Promise<Task> =>
    api.post('/tasks/trigger', data).then((res) => res.data),
  get: (id: string): Promise<Task> => api.get(`/tasks/${id}`).then((res) => res.data),
}
