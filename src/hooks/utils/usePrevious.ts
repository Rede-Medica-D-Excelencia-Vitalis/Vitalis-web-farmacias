import { useRef, useEffect } from 'react';

/**
 * Hook para acessar o valor anterior de uma variável
 * @param value - Valor atual
 * @returns Valor anterior
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

/**
 * Hook para detectar se é a primeira renderização
 * @returns true se for a primeira renderização
 */
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);
  
  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }
  
  return false;
}

/**
 * Hook para detectar mudanças em um valor
 * @param value - Valor a ser monitorado
 * @returns true se o valor mudou desde a última renderização
 */
export function useHasChanged<T>(value: T): boolean {
  const prevValue = usePrevious(value);
  return prevValue !== value;
}

/**
 * Hook para executar uma função apenas uma vez
 * @param callback - Função a ser executada
 * @param deps - Dependências para re-executar
 */
export function useOnce(callback: () => void, deps: any[] = []): void {
  const hasRun = useRef(false);
  
  useEffect(() => {
    if (!hasRun.current) {
      callback();
      hasRun.current = true;
    }
  }, deps);
}

/**
 * Hook para executar uma função quando um valor mudar
 * @param value - Valor a ser monitorado
 * @param callback - Função a ser executada quando o valor mudar
 */
export function useOnChange<T>(value: T, callback: (newValue: T, oldValue: T | undefined) => void): void {
  const prevValue = usePrevious(value);
  
  useEffect(() => {
    if (prevValue !== value) {
      callback(value, prevValue);
    }
  }, [value, prevValue, callback]);
}

/**
 * Hook para executar uma função quando um valor for truthy
 * @param value - Valor a ser monitorado
 * @param callback - Função a ser executada quando o valor for truthy
 */
export function useWhenTruthy<T>(value: T, callback: (value: T) => void): void {
  useEffect(() => {
    if (value) {
      callback(value);
    }
  }, [value, callback]);
}

/**
 * Hook para executar uma função quando um valor for falsy
 * @param value - Valor a ser monitorado
 * @param callback - Função a ser executada quando o valor for falsy
 */
export function useWhenFalsy<T>(value: T, callback: (value: T) => void): void {
  useEffect(() => {
    if (!value) {
      callback(value);
    }
  }, [value, callback]);
}

/**
 * Hook para executar uma função após um delay
 * @param callback - Função a ser executada
 * @param delay - Delay em milissegundos
 * @param deps - Dependências para re-executar
 */
export function useTimeout(callback: () => void, delay: number, deps: any[] = []): void {
  useEffect(() => {
    const timeoutId = setTimeout(callback, delay);
    return () => clearTimeout(timeoutId);
  }, [callback, delay, ...deps]);
}

/**
 * Hook para executar uma função em intervalos
 * @param callback - Função a ser executada
 * @param interval - Intervalo em milissegundos
 * @param deps - Dependências para re-executar
 */
export function useInterval(callback: () => void, interval: number, deps: any[] = []): void {
  useEffect(() => {
    const intervalId = setInterval(callback, interval);
    return () => clearInterval(intervalId);
  }, [callback, interval, ...deps]);
}
