/**
 * Layout para Páginas de Autenticação
 * 
 * Este layout é usado para páginas como login, registro, recuperação de senha, etc.
 * Fornece uma estrutura limpa e focada na autenticação.
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

interface AuthLayoutProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

/**
 * Componente de layout para páginas de autenticação
 * 
 * @param children - Componentes filhos a serem renderizados
 * @param title - Título da página de autenticação
 * @param subtitle - Subtítulo da página de autenticação
 * @param showLogo - Se deve mostrar o logo da aplicação
 * @returns JSX.Element - Layout de autenticação
 */
const AuthLayout = ({ 
  children, 
  title = "Bem-vindo ao Vitalis", 
  subtitle = "Sistema de Gestão para Farmácias",
  showLogo = true 
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo e título */}
          {showLogo && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">V</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-600">{subtitle}</p>
            </div>
          )}

          {/* Conteúdo da página */}
          <div className="space-y-6">
            {children || <Outlet />}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Vitalis. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Sistema de notificações */}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
