/**
 * Componente de Barra Lateral
 * 
 * Este arquivo contém:
 * 1. Menu de navegação principal
 * 2. Botão para recolher/expandir a barra lateral
 * 3. Botão de logout
 * 4. Integração com react-router para navegação
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Building2, 
  Users, 
  Settings, 
  HelpCircle,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import logo from '@/assets/logo-ext.png';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/orders' },
    { icon: Package, label: 'Produtos', path: '/products' },
    { icon: Building2, label: 'Farmácia', path: '/pharmacy' },

    { icon: Settings, label: 'Configurações', path: '/settings' },
    { icon: HelpCircle, label: 'Ajuda', path: '/help' },
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Vitalis" 
                className={`transition-all duration-300 ${isCollapsed ? 'h-8' : 'h-16'}`}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className={`
              flex items-center gap-3 mb-3
              ${isCollapsed ? 'justify-center' : ''}
            `}>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.nome || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'usuario@email.com'}
                  </p>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${isCollapsed ? 'px-2' : ''}`}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content margin */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`} />
    </>
  );
};

export default Sidebar;
