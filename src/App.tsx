/**
 * Componente Principal da Aplicação
 * 
 * Este arquivo contém:
 * 1. Configuração das rotas da aplicação
 * 2. Layout principal que envolve todas as páginas
 * 3. Tratamento de rotas não encontradas
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainLayout from '@/layouts/main/MainLayout';

// Páginas
import Login from '@/pages/auth/Login';
import Cadastro from '@/pages/auth/Cadastro';
import CadastroConcluido from '@/pages/auth/CadastroConcluido';
import Dashboard from '@/pages/business/Dashboard';
import Orders from '@/pages/business/Orders';
import Products from '@/pages/business/Products';
import Pharmacy from '@/pages/business/Pharmacy';

import Reports from '@/pages/business/Reports';
import Settings from '@/pages/system/Settings';
import Help from '@/pages/system/Help';
import Profile from '@/pages/system/Profile';
import TermosCondicao from '@/pages/legal/TermosCondicao';
import TermosConduta from '@/pages/legal/TermosConduta';
import NotFound from '@/pages/system/NotFound';

import './App.css';

// Componente de debug para verificar rotas
const RouteDebug = () => {
  const location = useLocation();
  console.log('📍 RouteDebug: Localização atual:', location.pathname);
  return null;
};

/**
 * Componente principal que configura as rotas da aplicação
 * 
 * @returns JSX.Element - Aplicação com rotas configuradas
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <RouteDebug />
        <div className="App">
          <Routes>
            {/* Rota padrão - redireciona para dashboard se autenticado */}
            <Route path="/" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Rota explícita do dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/cadastro-concluido" element={<CadastroConcluido />} />
            <Route path="/termos-condicao" element={<TermosCondicao />} />
            <Route path="/termos-conduta" element={<TermosConduta />} />
            
            {/* Rotas protegidas - Apenas farmácias */}
            <Route path="/orders" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Orders />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Products />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/pharmacy" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Pharmacy />
                </MainLayout>
              </ProtectedRoute>
            } />
            

            
            <Route path="/reports" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Reports />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/help" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Help />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute allowedTypes={['farmacia']}>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
