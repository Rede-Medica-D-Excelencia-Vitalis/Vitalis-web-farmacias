/**
 * Ponto de Entrada da Aplicação
 * 
 * Este arquivo contém:
 * 1. Configuração do React 18 com StrictMode
 * 2. Renderização do componente principal App
 * 3. Estilos globais da aplicação
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@/contexts';

/**
 * Renderiza a aplicação no elemento root do DOM
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
