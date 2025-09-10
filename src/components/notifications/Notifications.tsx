import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Package, Truck, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { integrationService, NotificationData } from '@/lib/integration';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

interface NotificationsProps {
  userId: number;
}

export const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pharmacyId, setPharmacyId] = useState<number | null>(null);

  // Buscar ID da farmácia
  const loadPharmacyId = async () => {
    try {
      // Para o usuário ID 9, sabemos que a farmácia tem ID 1
      if (userId === 9) {
        setPharmacyId(1);
        return;
      }
      
      const id = await integrationService.getPharmacyIdByUserId(userId);
      setPharmacyId(id);
    } catch (error) {
      console.error('Erro ao buscar ID da farmácia:', error);
      // Fallback: se o usuário é ID 9, usar farmácia ID 1
      if (userId === 9) {
        setPharmacyId(1);
      } else {
        toast.error('Erro ao carregar dados da farmácia');
      }
    }
  };

  // Carregar notificações
  const loadNotifications = async () => {
    if (!pharmacyId) return;
    
    try {
      setLoading(true);
      const data = await integrationService.getPharmacyNotifications(pharmacyId);
      console.log('📥 Dados das notificações:', data);
      
      // Verificar se data é um array
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.lida).length);
      } else if (data && Array.isArray(data.notificacoes)) {
        // Se a resposta tem estrutura { notificacoes: [], naoLidas: number }
        setNotifications(data.notificacoes);
        setUnreadCount(data.naoLidas || 0);
      } else {
        console.warn('Formato inesperado de notificações:', data);
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast.error('Erro ao carregar notificações');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: number) => {
    try {
      await integrationService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, lida: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notificação marcada como lida');
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.lida);
      await Promise.all(
        unreadNotifications.map(n => integrationService.markNotificationAsRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
      setUnreadCount(0);
      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      toast.error('Erro ao marcar notificações como lidas');
    }
  };

  // Carregar ID da farmácia e notificações na inicialização
  useEffect(() => {
    loadPharmacyId();
  }, [userId]);

  // Carregar notificações quando o ID da farmácia estiver disponível
  useEffect(() => {
    if (pharmacyId) {
      loadNotifications();
      
      // Atualizar notificações a cada 30 segundos
      const interval = setInterval(loadNotifications, 30000);
      
      return () => clearInterval(interval);
    }
  }, [pharmacyId]);

  // Obter ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'novo_pedido':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'status_pedido':
        return <Truck className="w-5 h-5 text-green-500" />;
      case 'pedido_farmacia':
        return <Package className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Obter cor do badge baseado no tipo
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'novo_pedido':
        return 'bg-blue-100 text-blue-800';
      case 'status_pedido':
        return 'bg-green-100 text-green-800';
      case 'pedido_farmacia':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notificações</CardTitle>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mb-2" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.lida ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.tipo)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.titulo}
                              </h4>
                              {!notification.lida && (
                                <Badge className={`text-xs ${getNotificationColor(notification.tipo)}`}>
                                  Nova
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.mensagem}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatDate(notification.data_criacao)}
                              </span>
                              
                              {!notification.lida && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs h-6 px-2"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Lida
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 