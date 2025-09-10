import { useState, useCallback, useEffect } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook para gerenciar chamadas de API
 * @param apiFunction - Função da API a ser executada
 * @param options - Opções de configuração
 * @returns Estado e métodos da API
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null
        });
        
        options.onSuccess?.(response.data);
      } else {
        throw new Error(response.message || 'Erro na requisição');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });
      
      options.onError?.(errorMessage);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    reset
  };
}

/**
 * Hook para gerenciar múltiplas chamadas de API
 * @param apiFunctions - Objeto com funções da API
 * @returns Objeto com estados e métodos para cada API
 */
export function useMultipleApis<T extends Record<string, (...args: any[]) => Promise<any>>>(
  apiFunctions: T
) {
  const results: Record<string, UseApiReturn<any>> = {} as Record<string, UseApiReturn<any>>;

  Object.keys(apiFunctions).forEach((key) => {
    const apiFunction = apiFunctions[key];
    results[key] = useApi(apiFunction);
  });

  return results;
}

/**
 * Hook para cache de dados da API
 * @param apiFunction - Função da API
 * @param cacheKey - Chave para o cache
 * @param cacheTime - Tempo de cache em milissegundos
 * @returns Estado e métodos da API com cache
 */
export function useApiWithCache<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  cacheKey: string,
  cacheTime: number = 5 * 60 * 1000 // 5 minutos padrão
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(`api_cache_${cacheKey}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTime) {
          return data;
        }
      }
    } catch (error) {
      console.error('Erro ao ler cache:', error);
    }
    return null;
  }, [cacheKey, cacheTime]);

  const setCachedData = useCallback((data: T) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`api_cache_${cacheKey}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }, [cacheKey]);

  const execute = useCallback(async (...args: any[]) => {
    // Verifica cache primeiro
    const cachedData = getCachedData();
    if (cachedData) {
      setState({
        data: cachedData,
        loading: false,
        error: null
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null
        });
        
        // Salva no cache
        setCachedData(response.data);
      } else {
        throw new Error(response.message || 'Erro na requisição');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });
    }
  }, [apiFunction, getCachedData, setCachedData]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
    
    // Remove do cache
    try {
      localStorage.removeItem(`api_cache_${cacheKey}`);
    } catch (error) {
      console.error('Erro ao remover cache:', error);
    }
  }, [cacheKey]);

  // Carrega dados do cache na inicialização
  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData) {
      setState({
        data: cachedData,
        loading: false,
        error: null
      });
    }
  }, [getCachedData]);

  return {
    ...state,
    execute,
    reset
  };
}
