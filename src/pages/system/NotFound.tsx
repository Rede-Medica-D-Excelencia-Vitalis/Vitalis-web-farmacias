/**
 * Página de Erro 404
 * 
 * Este arquivo contém:
 * 1. Mensagem de erro para páginas não encontradas
 * 2. Botão para retornar à página inicial
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

/**
 * Componente que exibe a página de erro 404
 * 
 * @returns JSX.Element - Página de erro com mensagem e botão de retorno
 */
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Página Não Encontrada</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Button asChild>
        <Link to="/">Voltar para o Início</Link>
      </Button>
    </div>
  );
};

export default NotFound;
