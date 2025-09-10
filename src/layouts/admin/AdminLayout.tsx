/**
 * Layout para Área Administrativa
 * 
 * Este layout é usado para páginas administrativas com controles avançados,
 * configurações do sistema e gerenciamento de usuários.
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Notifications } from '@/components/Notifications';
import { apiService } from '@/lib/api';
import { useState, useEffect } from 'react';

interface AdminLayoutProps {
  children?: React.ReactNode;
  showBreadcrumbs?: boolean;
  showActions?: boolean;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * Componente de layout para área administrativa
 * 
 * @param children - Componentes filhos a serem renderizados
 * @param showBreadcrumbs - Se deve mostrar breadcrumbs
 * @param showActions - Se deve mostrar área de ações
 * @param title - Título da página administrativa
 * @param subtitle - Subtítulo da página administrativa
 * @param actions - Componentes de ações customizadas
 * @returns JSX.Element - Layout administrativo
 */
const AdminLayout = ({ 
  children, 
  showBreadcrumbs = true,
  showActions = true,
  title = "Administração",
  subtitle = "Gerenciamento do sistema",
  actions
}: AdminLayoutProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = apiService.auth.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header administrativo */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            
            {/* Notificações e ações */}
            <div className="flex items-center space-x-4">
              {currentUser && currentUser.tipo_usuario === 'farmacia' && (
                <Notifications userId={currentUser.id} />
              )}
              
              {showActions && actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3">
              <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
                Admin
              </a>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-900">{title}</span>
            </div>
          </div>
        </nav>
      )}

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Área de ações administrativas */}
        {showActions && !actions && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Ações Administrativas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Adicionar Usuário
                </button>
                
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurações
                </button>
                
                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Relatórios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo específico da área administrativa */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Gerenciamento</h2>
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

export default AdminLayout;
