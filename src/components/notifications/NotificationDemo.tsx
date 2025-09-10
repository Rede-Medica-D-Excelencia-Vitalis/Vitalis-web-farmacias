import React from 'react';
import { Bell, Package, Truck, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import useNotifications from '@/hooks/notifications/useNotifications';

/**
 * Componente de demonstração das notificações da farmácia
 * Permite testar todos os tipos de notificação disponíveis
 */
const NotificationDemo: React.FC = () => {
  const notifications = useNotifications();

  const handleTestBasic = () => {
    notifications.showInfo('Teste Básico', 'Esta é uma notificação de teste básica', { sound: true });
  };

  const handleTestNewOrder = () => {
    notifications.showNewOrder('001', 'João Silva');
  };

  const handleTestStatusUpdate = () => {
    notifications.showOrderStatusUpdate('001', 'Em preparação');
  };

  const handleTestLowStock = () => {
    notifications.showLowStock('Paracetamol 500mg', 5);
  };

  const handleTestDelivery = () => {
    notifications.showDeliveryUpdate('001', 'Saiu para entrega');
  };

  const handleTestSuccess = () => {
    notifications.showSuccess('Sucesso!', 'Operação realizada com sucesso', { sound: true });
  };

  const handleTestError = () => {
    notifications.showError('Erro!', 'Ocorreu um erro na operação', { sound: true });
  };

  const handleTestWarning = () => {
    notifications.showWarning('Atenção!', 'Esta é uma notificação de aviso', { sound: true });
  };

  const handleTestAll = () => {
    // Sequência de notificações para demonstrar o sistema
    setTimeout(() => notifications.showNewOrder('001', 'Maria Santos'), 0);
    setTimeout(() => notifications.showOrderStatusUpdate('001', 'Aprovado'), 2000);
    setTimeout(() => notifications.showLowStock('Ibuprofeno 400mg', 3), 4000);
    setTimeout(() => notifications.showDeliveryUpdate('001', 'Entregue'), 6000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Bell className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Demonstração de Notificações</h3>
          <p className="text-sm text-gray-600">Teste todos os tipos de notificação disponíveis no sistema</p>
        </div>
      </div>

      {/* Notificações Básicas */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Notificações Básicas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleTestBasic}
            className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            <Info className="h-4 w-4 inline mr-2" />
            Info
          </button>
          <button
            onClick={handleTestSuccess}
            className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4 inline mr-2" />
            Sucesso
          </button>
          <button
            onClick={handleTestWarning}
            className="p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
          >
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Aviso
          </button>
          <button
            onClick={handleTestError}
            className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Erro
          </button>
        </div>
      </div>

      {/* Notificações Específicas da Farmácia */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Notificações da Farmácia</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleTestNewOrder}
            className="p-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
          >
            <Package className="h-4 w-4 inline mr-2" />
            Novo Pedido
          </button>
          <button
            onClick={handleTestStatusUpdate}
            className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            <CheckCircle className="h-4 w-4 inline mr-2" />
            Status Atualizado
          </button>
          <button
            onClick={handleTestLowStock}
            className="p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
          >
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Estoque Baixo
          </button>
          <button
            onClick={handleTestDelivery}
            className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
          >
            <Truck className="h-4 w-4 inline mr-2" />
            Atualização Entrega
          </button>
        </div>
      </div>

      {/* Botão de Teste Completo */}
      <div className="text-center">
        <button
          onClick={handleTestAll}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
        >
          <Bell className="h-4 w-4" />
          Testar Todas as Notificações
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Demonstra uma sequência completa de notificações da farmácia
        </p>
      </div>

      {/* Informações do Sistema */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Status do Sistema</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>🔔 <strong>Notificações:</strong> Sistema ativo com áudio</div>
          <div>🎵 <strong>Arquivo de Som:</strong> new-notification-09-352705.mp3</div>
          <div>⚙️ <strong>Configurações:</strong> Personalizáveis na aba de som</div>
          <div>📱 <strong>Compatibilidade:</strong> Funciona em todos os navegadores</div>
        </div>
      </div>
    </div>
  );
};

export { NotificationDemo };
export default NotificationDemo;
