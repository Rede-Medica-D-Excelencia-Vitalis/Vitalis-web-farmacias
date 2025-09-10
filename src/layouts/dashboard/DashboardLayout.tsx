/**
 * Layout para Dashboards
 * 
 * Este layout é otimizado para exibir dashboards com métricas, gráficos e widgets.
 * Inclui uma estrutura específica para organizar informações importantes.
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Notifications } from '@/components/Notifications';
import { apiService } from '@/lib/api';
import { useState, useEffect } from 'react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  showMetrics?: boolean;
  showNotifications?: boolean;
  title?: string;
  subtitle?: string;
}

/**
 * Componente de layout para dashboards
 * 
 * @param children - Componentes filhos a serem renderizados
 * @param showMetrics - Se deve mostrar a seção de métricas
 * @param showNotifications - Se deve mostrar notificações
 * @param title - Título do dashboard
 * @param subtitle - Subtítulo do dashboard
 * @returns JSX.Element - Layout de dashboard
 */
const DashboardLayout = ({ 
  children, 
  showMetrics = true,
  showNotifications = true,
  title = "Dashboard",
  subtitle = "Visão geral da farmácia"
}: DashboardLayoutProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = apiService.auth.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Dashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            
            {/* Notificações */}
            {showNotifications && currentUser && currentUser.tipo_usuario === 'farmacia' && (
              <div className="flex items-center space-x-4">
                <Notifications userId={currentUser.id} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção de métricas rápidas */}
        {showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pedidos Hoje</p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pacientes Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Produtos</p>
                  <p className="text-2xl font-semibold text-gray-900">1,234</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Baixo Estoque</p>
                  <p className="text-2xl font-semibold text-gray-900">8</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo específico do dashboard */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </div>
      </main>

      {/* Sistema de notificações */}
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
