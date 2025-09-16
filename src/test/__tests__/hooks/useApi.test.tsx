import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useApi, useMultipleApis, useApiWithCache } from '@/hooks/api/useApi'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useApi Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('deve executar requisição com sucesso', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Test' }
    })

    const { result } = renderHook(() => useApi(mockApiFunction))
    
    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual({ id: 1, name: 'Test' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(mockApiFunction).toHaveBeenCalledTimes(1)
  })

  it('deve tratar erros de requisição', async () => {
    const mockApiFunction = vi.fn().mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useApi(mockApiFunction))
    
    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('API Error')
  })

  it('deve tratar resposta com success false', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: false,
      message: 'Erro na requisição'
    })

    const { result } = renderHook(() => useApi(mockApiFunction))
    
    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Erro na requisição')
  })

  it('deve executar requisição imediatamente quando immediate=true', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Test' }
    })

    renderHook(() => useApi(mockApiFunction, { immediate: true }))

    await act(async () => {
      // Aguarda a execução automática
    })

    expect(mockApiFunction).toHaveBeenCalledTimes(1)
  })

  it('deve chamar onSuccess quando a requisição é bem-sucedida', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Test' }
    })
    const onSuccess = vi.fn()

    const { result } = renderHook(() => useApi(mockApiFunction, { onSuccess }))
    
    await act(async () => {
      await result.current.execute()
    })

    expect(onSuccess).toHaveBeenCalledWith({ id: 1, name: 'Test' })
  })

  it('deve chamar onError quando a requisição falha', async () => {
    const mockApiFunction = vi.fn().mockRejectedValue(new Error('API Error'))
    const onError = vi.fn()

    const { result } = renderHook(() => useApi(mockApiFunction, { onError }))
    
    await act(async () => {
      await result.current.execute()
    })

    expect(onError).toHaveBeenCalledWith('API Error')
  })

  it('deve resetar o estado quando reset é chamado', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Test' }
    })

    const { result } = renderHook(() => useApi(mockApiFunction))
    
    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual({ id: 1, name: 'Test' })

    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('deve passar argumentos para a função da API', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Test' }
    })

    const { result } = renderHook(() => useApi(mockApiFunction))
    
    await act(async () => {
      await result.current.execute('arg1', 'arg2', { key: 'value' })
    })

    expect(mockApiFunction).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' })
  })
})

describe('useMultipleApis Hook', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('deve gerenciar múltiplas APIs', () => {
    const mockApi1 = vi.fn().mockResolvedValue({ success: true, data: 'data1' })
    const mockApi2 = vi.fn().mockResolvedValue({ success: true, data: 'data2' })

    const { result } = renderHook(() => useMultipleApis({
      api1: mockApi1,
      api2: mockApi2
    }))

    expect(result.current.api1).toBeDefined()
    expect(result.current.api2).toBeDefined()
    expect(result.current.api1.execute).toBeDefined()
    expect(result.current.api2.execute).toBeDefined()
  })
})

describe('useApiWithCache Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('deve usar dados do cache quando disponíveis', async () => {
    const cachedData = { id: 1, name: 'Cached Data' }
    const cacheData = {
      data: cachedData,
      timestamp: Date.now()
    }
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 2, name: 'New Data' }
    })

    const { result } = renderHook(() => useApiWithCache(mockApiFunction, 'test-cache', 5000))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual(cachedData)
    expect(mockApiFunction).not.toHaveBeenCalled()
  })

  it('deve executar API quando cache expirou', async () => {
    const expiredCacheData = {
      data: { id: 1, name: 'Expired Data' },
      timestamp: Date.now() - 10000 // 10 segundos atrás
    }
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredCacheData))

    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 2, name: 'New Data' }
    })

    const { result } = renderHook(() => useApiWithCache(mockApiFunction, 'test-cache', 5000))

    await act(async () => {
      await result.current.execute()
    })

    expect(result.current.data).toEqual({ id: 2, name: 'New Data' })
    expect(mockApiFunction).toHaveBeenCalledTimes(1)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('deve salvar dados no cache após execução bem-sucedida', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'New Data' }
    })

    const { result } = renderHook(() => useApiWithCache(mockApiFunction, 'test-cache', 5000))

    await act(async () => {
      await result.current.execute()
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'api_cache_test-cache',
      expect.stringContaining('"id":1,"name":"New Data"')
    )
  })

  it('deve limpar cache quando reset é chamado', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, name: 'Data' }
    })

    const { result } = renderHook(() => useApiWithCache(mockApiFunction, 'test-cache', 5000))

    await act(async () => {
      await result.current.execute()
    })

    act(() => {
      result.current.reset()
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('api_cache_test-cache')
  })

  it('deve carregar dados do cache na inicialização', async () => {
    const cachedData = { id: 1, name: 'Cached Data' }
    const cacheData = {
      data: cachedData,
      timestamp: Date.now()
    }
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(cacheData))

    const mockApiFunction = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 2, name: 'New Data' }
    })

    const { result } = renderHook(() => useApiWithCache(mockApiFunction, 'test-cache', 5000))

    // Aguarda o useEffect de inicialização
    await act(async () => {
      // Simula o tempo de carregamento
    })

    expect(result.current.data).toEqual(cachedData)
  })
})
