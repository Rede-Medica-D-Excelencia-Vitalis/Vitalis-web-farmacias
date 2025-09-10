/**
 * Layout Principal da Aplicação
 * 
 * Este arquivo contém:
 * 1. Estrutura base do layout com barra lateral e área de conteúdo
 * 2. Integração do sistema de notificações
 * 3. Container responsivo para o conteúdo
 */

import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Notifications } from '@/components/Notifications';
import { apiService } from '@/lib/api';
import { useState, useEffect } from 'react';

interface MainLayoutProps {
  children?: React.ReactNode;
}

/**
 * Componente de layout principal que envolve toda a aplicação
 * 
 * @param children - Componentes filhos a serem renderizados
 * @returns JSX.Element - Layout principal com barra lateral e área de conteúdo
 */
const MainLayout = ({ children }: MainLayoutProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = apiService.auth.getCurrentUser();
    setCurrentUser(user);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barra lateral de navegação */}
      <Sidebar />
      
      {/* Área principal de conteúdo */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {children || <Outlet />}
        </div>
      </main>
      
      {/* Componente de notificações */}
      {currentUser && currentUser.tipo_usuario === 'farmacia' && (
        <div className="fixed top-4 right-4 z-50">
          <Notifications userId={currentUser.id} />
        </div>
      )}
      
      {/* Sistema de notificações */}
      <Toaster />
    </div>
  );
};

export default MainLayout;
