import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from '@/services/api'
import { useAuthStore } from '../authStore'

vi.mock('@/services/api')
const mockedApi = api as vi.Mocked<typeof api>

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should login successfully', async () => {
    const authStore = useAuthStore()
    const mockResponse = {
      data: {
        access_token: 'valid-token',
        user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'ACS' },
      },
    }

    mockedApi.post.mockResolvedValueOnce(mockResponse)

    const result = await authStore.login('12345678900', 'password')

    expect(result).toBe(true)
    expect(authStore.token).toBe('valid-token')
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.user?.name).toBe('Test User')
    expect(localStorage.getItem('token')).toBe('valid-token')
  })

  it('should fail login with wrong credentials', async () => {
    const authStore = useAuthStore()
    mockedApi.post.mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas' } },
    })

    const result = await authStore.login('wrong', 'wrong')

    expect(result).toBe(false)
    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.error).toBe('Credenciais inválidas')
  })

  it('should logout correctly', () => {
    const authStore = useAuthStore()
    authStore.token = 'token'
    authStore.isAuthenticated = true
    localStorage.setItem('token', 'token')

    authStore.logout()

    expect(authStore.token).toBe(null)
    expect(authStore.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBe(null)
  })
})
