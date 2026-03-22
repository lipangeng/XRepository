export interface User {
  username: string
  role: string
}

export interface Repository {
  name: string
  type: 'hosted' | 'proxy' | 'group'
  format: 'docker' | 'helm' | 'maven' | 'npm' | 'pypi'
  createdAt: string
}

export interface Artifact {
  repo: string
  path: string
  format: string
  size: number
  checksum: string
  createdAt: string
}

export interface Task {
  id: string
  type: string
  repo: string
  status: 'pending' | 'running' | 'success' | 'failed'
  message: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface CreateRepoRequest {
  name: string
  type: Repository['type']
  format: Repository['format']
}

export interface TriggerTaskRequest {
  type: string
  repo: string
}
