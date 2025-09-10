import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedTypes?: ('farmacia' | 'paciente' | 'medico' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedTypes 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('🔒 ProtectedRoute Debug:', { 
    isAuthenticated, 
    isLoading, 
    user, 
    allowedTypes,
    pathname: window.location.pathname 
  });

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Carregando...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Verificar tipo de usuário se especificado
  if (allowedTypes && user && !allowedTypes.includes(user.tipo_usuario)) {
    console.log('🚫 ProtectedRoute: Tipo de usuário não permitido:', user.tipo_usuario, 'Permitidos:', allowedTypes);
    
    // Redirecionar para login com parâmetros informativos
    const params = new URLSearchParams({
      accessDenied: 'true',
      userType: user.tipo_usuario,
      requiredType: allowedTypes.join(','),
      path: window.location.pathname
    });
    
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  console.log('✅ ProtectedRoute: Acesso permitido, renderizando componente');
  return <>{children}</>;
};

export default ProtectedRoute; 