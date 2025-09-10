/**
 * Layout para Páginas Públicas
 * 
 * Este layout é usado para páginas públicas como landing pages, páginas informativas,
 * termos de uso, política de privacidade, etc.
 */

import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

interface PublicLayoutProps {
  children?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Componente de layout para páginas públicas
 * 
 * @param children - Componentes filhos a serem renderizados
 * @param showHeader - Se deve mostrar o header
 * @param showFooter - Se deve mostrar o footer
 * @param title - Título da página
 * @param description - Descrição da página
 * @param className - Classes CSS adicionais
 * @returns JSX.Element - Layout público
 */
const PublicLayout = ({ 
  children, 
  showHeader = true,
  showFooter = true,
  title = "Vitalis",
  description = "Sistema de Gestão para Farmácias",
  className = ""
}: PublicLayoutProps) => {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Header público */}
      {showHeader && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                  <span className="text-white text-lg font-bold">V</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>

              {/* Navegação */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Início
                </a>
                <a href="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre
                </a>
                <a href="/contato" className="text-gray-600 hover:text-gray-900">
                  Contato
                </a>
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Entrar
                </a>
              </nav>

              {/* Menu mobile */}
              <div className="md:hidden">
                <button className="text-gray-600 hover:text-gray-900">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Conteúdo principal */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* Footer público */}
      {showFooter && (
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Informações da empresa */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
                    <span className="text-white text-lg font-bold">V</span>
                  </div>
                  <span className="text-xl font-bold">Vitalis</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Sistema completo de gestão para farmácias, otimizando processos 
                  e melhorando a experiência dos pacientes.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links úteis */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                  Produto
                </h3>
                <ul className="space-y-2">
                  <li><a href="/recursos" className="text-gray-300 hover:text-white">Recursos</a></li>
                  <li><a href="/precos" className="text-gray-300 hover:text-white">Preços</a></li>
                  <li><a href="/demo" className="text-gray-300 hover:text-white">Demo</a></li>
                  <li><a href="/integracao" className="text-gray-300 hover:text-white">Integração</a></li>
                </ul>
              </div>

              {/* Suporte */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                  Suporte
                </h3>
                <ul className="space-y-2">
                  <li><a href="/ajuda" className="text-gray-300 hover:text-white">Central de Ajuda</a></li>
                  <li><a href="/contato" className="text-gray-300 hover:text-white">Contato</a></li>
                  <li><a href="/status" className="text-gray-300 hover:text-white">Status do Sistema</a></li>
                  <li><a href="/documentacao" className="text-gray-300 hover:text-white">Documentação</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm text-center">
                © 2024 Vitalis. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Sistema de notificações */}
      <Toaster />
    </div>
  );
};

export default PublicLayout;
