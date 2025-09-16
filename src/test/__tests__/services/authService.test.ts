import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock do axios
vi.mock('@/lib/api/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

import { authService } from '@/services/api/authService'
import { api } from '@/lib/api/api'

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: { id: 1, nome: 'Test', email: 'test@test.com' }
        }
      }

      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const credentials = {
        email: 'test@test.com',
        senha: 'password'
      }

      const result = await authService.login(credentials)

      expect(result).toEqual(mockResponse.data)
      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vitalis_auth_token', 'mock-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vitalis_refresh_token', 'mock-refresh-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vitalis_user_data', JSON.stringify(mockResponse.data.user))
    })

    it('deve tratar erro no login', async () => {
      const error = new Error('Credenciais inválidas')
      vi.mocked(api.post).mockRejectedValue(error)

      const credentials = {
        email: 'test@test.com',
        senha: 'wrong-password'
      }

      await expect(authService.login(credentials)).rejects.toThrow('Credenciais inválidas')
    })
  })

  describe('logout', () => {
    it('deve fazer logout com refresh token', async () => {
      localStorageMock.getItem.mockReturnValue('mock-refresh-token')
      vi.mocked(api.post).mockResolvedValue({ data: {} })

      await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'mock-refresh-token' })
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_refresh_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_user_data')
    })

    it('deve limpar dados locais mesmo se API falhar', async () => {
      localStorageMock.getItem.mockReturnValue('mock-refresh-token')
      vi.mocked(api.post).mockRejectedValue(new Error('API Error'))

      await authService.logout()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_refresh_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_user_data')
    })

    it('deve limpar dados locais mesmo sem refresh token', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      await authService.logout()

      expect(api.post).not.toHaveBeenCalled()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_refresh_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_user_data')
    })
  })

  describe('refreshToken', () => {
    it('deve renovar token com sucesso', async () => {
      localStorageMock.getItem.mockReturnValue('mock-refresh-token')
      const mockResponse = {
        data: { token: 'new-token' }
      }
      vi.mocked(api.post).mockResolvedValue(mockResponse)

      const result = await authService.refreshToken()

      expect(result).toBe('new-token')
      expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'mock-refresh-token' })
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vitalis_auth_token', 'new-token')
    })

    it('deve falhar quando não há refresh token', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      await expect(authService.refreshToken()).rejects.toThrow('Refresh token não encontrado')
    })

    it('deve limpar dados quando refresh falha', async () => {
      localStorageMock.getItem.mockReturnValue('mock-refresh-token')
      vi.mocked(api.post).mockRejectedValue(new Error('Refresh failed'))

      await expect(authService.refreshToken()).rejects.toThrow('Refresh failed')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_refresh_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_user_data')
    })
  })

  describe('getProfile', () => {
    it('deve obter perfil do usuário', async () => {
      const mockUser = { id: 1, nome: 'Test', email: 'test@test.com' }
      const mockResponse = { data: mockUser }
      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await authService.getProfile()

      expect(result).toEqual(mockUser)
      expect(api.get).toHaveBeenCalledWith('/auth/profile')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vitalis_user_data', JSON.stringify(mockUser))
    })

    it('deve tratar erro ao obter perfil', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Profile error'))

      await expect(authService.getProfile()).rejects.toThrow('Profile error')
    })
  })

  describe('isAuthenticated', () => {
    it('deve retornar true quando usuário está autenticado', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token') // token
        .mockReturnValueOnce(JSON.stringify({ id: 1, nome: 'Test' })) // user

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('deve retornar false quando não há token', () => {
      localStorageMock.getItem
        .mockReturnValueOnce(null) // token
        .mockReturnValueOnce(JSON.stringify({ id: 1, nome: 'Test' })) // user

      expect(authService.isAuthenticated()).toBe(false)
    })

    it('deve retornar false quando não há usuário', () => {
      localStorageMock.getItem
        .mockReturnValueOnce('mock-token') // token
        .mockReturnValueOnce(null) // user

      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('getToken', () => {
    it('deve retornar token do localStorage', () => {
      localStorageMock.getItem.mockReturnValue('mock-token')

      expect(authService.getToken()).toBe('mock-token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('vitalis_auth_token')
    })
  })

  describe('getRefreshToken', () => {
    it('deve retornar refresh token do localStorage', () => {
      localStorageMock.getItem.mockReturnValue('mock-refresh-token')

      expect(authService.getRefreshToken()).toBe('mock-refresh-token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('vitalis_refresh_token')
    })
  })

  describe('getUser', () => {
    it('deve retornar usuário do localStorage', () => {
      const mockUser = { id: 1, nome: 'Test', email: 'test@test.com' }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

      expect(authService.getUser()).toEqual(mockUser)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('vitalis_user_data')
    })

    it('deve retornar null quando não há usuário', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.getUser()).toBe(null)
    })
  })

  describe('clearAuthData', () => {
    it('deve limpar todos os dados de autenticação', () => {
      authService.clearAuthData()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_refresh_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('vitalis_user_data')
    })
  })

  describe('isTokenExpired', () => {
    it('deve retornar true quando não há token', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.isTokenExpired()).toBe(true)
    })

    it('deve retornar true quando token é inválido', () => {
      localStorageMock.getItem.mockReturnValue('invalid-token')

      expect(authService.isTokenExpired()).toBe(true)
    })

    it('deve retornar false quando token é válido e não expirado', () => {
      // Token válido que expira em 1 hora
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }
      const token = 'header.' + btoa(JSON.stringify(payload)) + '.signature'
      localStorageMock.getItem.mockReturnValue(token)

      expect(authService.isTokenExpired()).toBe(false)
    })

    it('deve retornar true quando token está expirado', () => {
      // Token expirado há 1 hora
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600 }
      const token = 'header.' + btoa(JSON.stringify(payload)) + '.signature'
      localStorageMock.getItem.mockReturnValue(token)

      expect(authService.isTokenExpired()).toBe(true)
    })
  })

  describe('getTokenInfo', () => {
    it('deve retornar informações do token', () => {
      const payload = { exp: 1234567890, iat: 1234567800, sub: 'user123' }
      const token = 'header.' + btoa(JSON.stringify(payload)) + '.signature'
      localStorageMock.getItem.mockReturnValue(token)

      expect(authService.getTokenInfo()).toEqual(payload)
    })

    it('deve retornar null quando não há token', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.getTokenInfo()).toBe(null)
    })

    it('deve retornar null quando token é inválido', () => {
      localStorageMock.getItem.mockReturnValue('invalid-token')

      expect(authService.getTokenInfo()).toBe(null)
    })
  })
})
