import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import type { User } from '../types'

const API_BASE = 'http://localhost:8080/api'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  restoreAuth: () => Promise<void>
  reset: () => void
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password })
        const { token, user } = response.data
        set({ token, user, isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false })
      },

      restoreAuth: async () => {
        const token = get().token
        if (token) {
          try {
            const response = await api.get('/auth/me')
            set({ user: response.data, isAuthenticated: true })
          } catch {
            set({ token: null, user: null, isAuthenticated: false })
          }
        }
        set({ isLoading: false })
      },

      reset: () => {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
)

api.interceptors.request.use((config) => {
  const token = authStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const { login, logout, restoreAuth } = authStore
export const useAuth = () => authStore()
export { api }
