import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authStore } from './auth-store'

describe('auth-store', () => {
  beforeEach(() => {
    localStorage.clear()
    authStore.getState().reset()
  })

  it('should be unauthenticated initially', () => {
    const state = authStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
  })

  it('should have login function', () => {
    const state = authStore.getState()
    expect(typeof state.login).toBe('function')
  })

  it('should have logout function', () => {
    const state = authStore.getState()
    expect(typeof state.logout).toBe('function')
  })

  it('should clear state on logout', () => {
    authStore.setState({ token: 'test-token', user: { username: 'test', role: 'admin' }, isAuthenticated: true })
    authStore.getState().logout()
    const state = authStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })
})
