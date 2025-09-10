/**
 * Componente de Lista de Pedidos
 * 
 * Este arquivo contém:
 * 1. Componente OrdersListItem para exibir um pedido individual
 * 2. Componente principal OrdersList que gerencia a lista de pedidos
 * 3. Sistema de abas para separar pedidos atuais e histórico
 * 4. Gerenciamento de status dos pedidos
 */

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/types';
import { orders } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Check, X, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import OrderTrackingMap from './OrderTrackingMap';

/**
 * Componente para exibir um pedido individual
 * 
 * @param order - Objeto contendo os dados do pedido
 * @param onStatusChange - Função para atualizar o status do pedido
 * @returns JSX.Element - Card com os detalhes do pedido e ações disponíveis
 */
const OrdersListItem = ({ 
  order, 
  onStatusChange 
}: { 
  order: Order, 
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void 
}) => {
  // Estado para controlar a visibilidade do mapa
  const [showMap, setShowMap] = useState(false);

  /**
   * Retorna o badge de status com a cor apropriada
   * 
   * @param status - Status atual do pedido
   * @returns JSX.Element - Badge estilizado com o status
   */
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Aguardando</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Aceito</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejeitado</Badge>;
      case 'with_delivery':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Em entrega</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Entregue</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  /**
   * Renderiza os botões de ação baseado no status atual do pedido
   * 
   * @returns JSX.Element - Botões de ação disponíveis para o status atual
   */
  const renderActionButtons = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <Button 
              onClick={() => onStatusChange(order.id, 'accepted')} 
              size="sm" 
              className="bg-pharmacy-success hover:bg-green-600"
            >
              <Check className="mr-1 h-4 w-4" /> Aceitar
            </Button>
            <Button 
              onClick={() => onStatusChange(order.id, 'rejected')} 
              size="sm" 
              variant="destructive"
            >
              <X className="mr-1 h-4 w-4" /> Rejeitar
            </Button>
          </div>
        );
      case 'accepted':
        return (
          <Button 
            onClick={() => onStatusChange(order.id, 'with_delivery')} 
            size="sm" 
            className="bg-pharmacy-primary hover:bg-blue-600"
          >
            Pedido com o entregador
          </Button>
        );
      case 'with_delivery':
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-white text-pharmacy-primary border-pharmacy-primary hover:bg-pharmacy-primary hover:text-white"
            onClick={() => {
              setShowMap(!showMap);
              toast({
                title: showMap ? "Rastreamento Encerrado" : "Rastreamento Ativo",
                description: showMap 
                  ? "O rastreamento foi encerrado." 
                  : "Acompanhe o trajeto do entregador no mapa abaixo.",
              });
            }}
          >
            <MapPin className="mr-1 h-4 w-4" /> {showMap ? "Ocultar Rastreamento" : "Rastrear"}
          </Button>
        );
      default:
        return null;
    }
  };

  const formattedDate = new Date(order.date).toLocaleString();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
          <p className="text-gray-600">{order.customer.name}</p>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(order.status)}
          {renderActionButtons(order.status)}
        </div>
      </div>
      
      {/* Mostra o mapa apenas quando o botão de rastrear for clicado */}
      {order.status === 'with_delivery' && showMap && (
        <div className="mt-4">
          <OrderTrackingMap
            latitude={order.latitude || -23.5505}
            longitude={order.longitude || -46.6333}
            orderId={order.id}
            className="rounded-lg overflow-hidden"
          />
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Itens:</h4>
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.product.name}</span>
              <span>{item.quantity}x</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="font-medium">Total: R$ {order.total.toFixed(2)}</span>
        <span className="text-sm text-gray-500">#{order.id}</span>
      </div>
    </div>
  );
};

/**
 * Componente principal que gerencia a lista de pedidos
 * 
 * @returns JSX.Element - Lista de pedidos com abas para pedidos atuais e histórico
 */
const OrdersList = () => {
  // Estado para gerenciar a lista de pedidos
  const [ordersList, setOrdersList] = useState<Order[]>(orders);
  
  /**
   * Atualiza o status de um pedido e mostra notificação apropriada
   * 
   * @param orderId - ID do pedido a ser atualizado
   * @param newStatus - Novo status do pedido
   */
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = ordersList.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        
        // Mostra notificações baseado na mudança de status
        if (newStatus === 'rejected') {
          toast({
            title: "Pedido Cancelado",
            description: `O pedido ${order.orderNumber} foi rejeitado.`,
            variant: "destructive",
          });
        } else if (newStatus === 'accepted') {
          toast({
            title: "Pedido Aceito",
            description: `O pedido ${order.orderNumber} foi aceito com sucesso.`,
          });
        } else if (newStatus === 'with_delivery') {
          toast({
            title: "Pedido em Entrega",
            description: `O pedido ${order.orderNumber} está com o entregador.`,
          });
        } else if (newStatus === 'delivered') {
          toast({
            title: "Entrega Concluída",
            description: `O pedido ${order.orderNumber} foi entregue com sucesso.`,
          });
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrdersList(updatedOrders);
  };
  
  // Filtra pedidos pendentes e em andamento
  const pendingOrders = ordersList.filter(order => 
    ['pending', 'accepted', 'with_delivery'].includes(order.status)
  );
  
  // Filtra pedidos concluídos (entregues ou rejeitados)
  const completedOrders = ordersList.filter(order => 
    ['delivered', 'rejected'].includes(order.status)
  );

  return (
    <Tabs defaultValue="current">
      {/* Abas para navegar entre pedidos atuais e histórico */}
      <TabsList className="mb-4">
        <TabsTrigger value="current">Pedidos Atuais</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>
      
      {/* Conteúdo da aba de pedidos atuais */}
      <TabsContent value="current">
        <div className="space-y-4">
          {pendingOrders.length > 0 ? (
            pendingOrders.map(order => (
              <OrdersListItem 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500">Não há pedidos atuais.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
      
      {/* Conteúdo da aba de histórico */}
      <TabsContent value="history">
        <div className="space-y-4">
          {completedOrders.length > 0 ? (
            completedOrders.map(order => (
              <OrdersListItem 
                key={order.id} 
                order={order} 
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-gray-500">Não há pedidos no histórico.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export { OrdersList };
export default OrdersList;
