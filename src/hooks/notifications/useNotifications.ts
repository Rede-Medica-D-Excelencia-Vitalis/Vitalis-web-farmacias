import { useCallback } from 'react';
import notificationService from '@/services/notifications/notificationService';

/**
 * Hook personalizado para usar o serviço de notificações da farmácia
 * 
 * @returns Objeto com métodos para diferentes tipos de notificação
 */
export const useNotifications = () => {
  // Notificações básicas
  const showSuccess = useCallback((title: string, message: string, options?: any) => {
    return notificationService.success(title, message, options);
  }, []);

  const showError = useCallback((title: string, message: string, options?: any) => {
    return notificationService.error(title, message, options);
  }, []);

  const showInfo = useCallback((title: string, message: string, options?: any) => {
    return notificationService.info(title, message, options);
  }, []);

  const showWarning = useCallback((title: string, message: string, options?: any) => {
    return notificationService.warning(title, message, options);
  }, []);

  // Notificações específicas para farmácia
  const showNewOrder = useCallback((orderNumber: string, patientName: string) => {
    return notificationService.newOrder(orderNumber, patientName);
  }, []);

  const showOrderStatusUpdate = useCallback((orderNumber: string, newStatus: string) => {
    return notificationService.orderStatusUpdate(orderNumber, newStatus);
  }, []);

  const showLowStock = useCallback((productName: string, currentStock: number) => {
    return notificationService.lowStock(productName, currentStock);
  }, []);

  const showDeliveryUpdate = useCallback((orderNumber: string, status: string) => {
    return notificationService.deliveryUpdate(orderNumber, status);
  }, []);

  // Configurações de som
  const setSoundConfig = useCallback((config: any) => {
    notificationService.setSoundConfig(config);
  }, []);

  const getSoundConfig = useCallback(() => {
    return notificationService.getSoundConfig();
  }, []);

  const setNotificationSound = useCallback((type: 'default' | 'gentle' | 'alert' | 'chime' | 'beep') => {
    notificationService.setNotificationSound(type);
  }, []);

  // Teste
  const testNotification = useCallback(() => {
    return notificationService.test();
  }, []);

  // Status
  const getStatus = useCallback(() => {
    return notificationService.getStatus();
  }, []);

  return {
    // Notificações básicas
    showSuccess,
    showError,
    showInfo,
    showWarning,
    
    // Notificações específicas para farmácia
    showNewOrder,
    showOrderStatusUpdate,
    showLowStock,
    showDeliveryUpdate,
    
    // Configurações de som
    setSoundConfig,
    getSoundConfig,
    setNotificationSound,
    
    // Utilitários
    testNotification,
    getStatus
  };
};

export default useNotifications;
