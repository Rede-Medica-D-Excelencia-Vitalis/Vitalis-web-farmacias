import React from 'react';

interface AccessDeniedProps {
  userType: string;
  allowedTypes: string[];
  currentPath?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  userType, 
  allowedTypes, 
  currentPath 
}) => {
  const handleLoginAsFarmacia = () => {
    // Limpar dados de autenticação
    localStorage.clear();
    // Redirecionar para login
    window.location.href = '/login';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Ícone de Acesso Negado */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            {/* Título */}
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Acesso Negado
            </h3>
            
            {/* Descrição */}
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Você não tem permissão para acessar esta área.
              </p>
              {currentPath && (
                <p className="mt-1">
                  <strong>Página solicitada:</strong> {currentPath}
                </p>
              )}
              <p className="mt-1">
                <strong>Tipo de usuário atual:</strong> {userType}
              </p>
              <p className="mt-1">
                <strong>Tipos permitidos:</strong> {allowedTypes.join(', ')}
              </p>
            </div>
            
            {/* Botões de Ação */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleLoginAsFarmacia}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Fazer Login como Farmácia
              </button>
              
              <button
                onClick={handleGoBack}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
            </div>
            
            {/* Informações Adicionais */}
            <div className="mt-6 text-xs text-gray-400">
              <p>Se você acredita que isso é um erro, entre em contato com o suporte.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
