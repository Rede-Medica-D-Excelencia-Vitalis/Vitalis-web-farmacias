import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface NotificationOptions {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  sound?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private audioContext: AudioContext | null = null;
  private notificationSound: HTMLAudioElement | null = null;
  private isInitialized = false;
  
  // Configurações de som personalizáveis
  private soundConfig = {
    volume: 0.5,         // Volume (0.0 a 1.0)
    playbackRate: 1.0,   // Velocidade de reprodução
    loop: false           // Se deve repetir
  };

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Inicializar contexto de áudio primeiro (não depende de permissões)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.loadNotificationSound();
      
      // Marcar como inicializado mesmo sem permissões de notificação do navegador
      // Nossas notificações customizadas funcionam independentemente
      this.isInitialized = true;
      
      // Tentar solicitar permissão para notificações do navegador (opcional)
      if ('Notification' in window && 'permission' in Notification) {
        try {
          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
        } catch (permError) {
          console.log('Permissão de notificação não concedida, mas notificações customizadas funcionarão');
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar serviço de notificações:', error);
      // Mesmo com erro, marcar como inicializado para notificações customizadas
      this.isInitialized = true;
    }
  }

  private async loadNotificationSound() {
    try {
      // Criar elemento de áudio com o arquivo real da farmácia
      this.notificationSound = new Audio('/src/assets/new-notification-09-352705.mp3');
      
      // Configurar propriedades do áudio
      this.notificationSound.volume = this.soundConfig.volume;
      this.notificationSound.playbackRate = this.soundConfig.playbackRate;
      this.notificationSound.loop = this.soundConfig.loop;
      
      // Pré-carregar o áudio
      this.notificationSound.load();
      
      console.log('🔔 Som de notificação da farmácia carregado do arquivo MP3');
    } catch (error) {
      console.log('Erro ao carregar som de notificação, notificações funcionarão sem som:', error);
      this.notificationSound = null;
    }
  }

  private playNotificationSound() {
    try {
      if (this.notificationSound) {
        // Resetar o áudio para o início
        this.notificationSound.currentTime = 0;
        
        // Aplicar configurações atuais
        this.notificationSound.volume = this.soundConfig.volume;
        this.notificationSound.playbackRate = this.soundConfig.playbackRate;
        
        // Reproduzir o som
        this.notificationSound.play().catch(playError => {
          console.log('Erro ao reproduzir som:', playError);
        });
      }
    } catch (error) {
      console.log('Erro ao tocar som de notificação:', error);
      // Não é crítico, apenas log
    }
  }

  private createNotificationElement(options: NotificationOptions): HTMLDivElement {
    const notification = document.createElement('div');
    
    const typeColors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    const typeIcons = {
      success: '<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
      error: '<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
      info: '<svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
      warning: '<svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>'
    };

    notification.className = `fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border ${typeColors[options.type]} transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;
    notification.style.zIndex = '9999';

    notification.innerHTML = `
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            ${typeIcons[options.type]}
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium">${options.title}</h3>
            <p class="mt-1 text-sm opacity-90">${options.message}</p>
            ${options.action ? `
              <div class="mt-3">
                <button class="text-sm font-medium underline hover:no-underline transition-all">
                  ${options.action.label}
                </button>
              </div>
            ` : ''}
          </div>
          <div class="ml-4 flex-shrink-0">
            <button class="inline-flex text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Adicionar evento de fechar
    const closeButton = notification.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.removeNotification(notification));
    }

    // Adicionar evento de ação
    if (options.action) {
      const actionButton = notification.querySelector('button.underline');
      if (actionButton) {
        actionButton.addEventListener('click', options.action.onClick);
      }
    }

    return notification;
  }

  private removeNotification(notification: HTMLDivElement) {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  private showNotification(options: NotificationOptions) {
    try {
      // Tocar som se habilitado e disponível
      if (options.sound !== false && this.notificationSound) {
        this.playNotificationSound();
      }

      // Criar elemento da notificação
      const notification = this.createNotificationElement(options);
      
      // Adicionar ao DOM
      document.body.appendChild(notification);
      
      // Animar entrada
      setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
      }, 100);

      // Remover automaticamente após duração
      const duration = options.duration || 5000;
      setTimeout(() => {
        this.removeNotification(notification);
      }, duration);

      return notification;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      // Fallback: mostrar notificação simples no console
      console.log(`🔔 ${options.title}: ${options.message}`);
      return null;
    }
  }

  // Métodos públicos para diferentes tipos de notificação
  success(title: string, message: string, options?: Partial<NotificationOptions>) {
    return this.showNotification({
      title,
      message,
      type: 'success',
      ...options
    });
  }

  error(title: string, message: string, options?: Partial<NotificationOptions>) {
    return this.showNotification({
      title,
      message,
      type: 'error',
      ...options
    });
  }

  info(title: string, message: string, options?: Partial<NotificationOptions>) {
    return this.showNotification({
      title,
      message,
      type: 'info',
      ...options
    });
  }

  warning(title: string, message: string, options?: Partial<NotificationOptions>) {
    return this.showNotification({
      title,
      message,
      type: 'warning',
      ...options
    });
  }

  // Notificação personalizada
  custom(options: NotificationOptions) {
    return this.showNotification(options);
  }

  // Notificações específicas para farmácia
  newOrder(orderNumber: string, patientName: string) {
    return this.info(
      'Novo Pedido Recebido',
      `Pedido #${orderNumber} de ${patientName}`,
      {
        duration: 8000,
        sound: true,
        action: {
          label: 'Ver pedido',
          onClick: () => {
            console.log('Navegando para o pedido...');
            // Aqui você pode adicionar navegação para o pedido
          }
        }
      }
    );
  }

  orderStatusUpdate(orderNumber: string, newStatus: string) {
    return this.success(
      'Status do Pedido Atualizado',
      `Pedido #${orderNumber} agora está ${newStatus}`,
      {
        duration: 6000,
        sound: true,
        action: {
          label: 'Ver detalhes',
          onClick: () => {
            console.log('Navegando para detalhes do pedido...');
          }
        }
      }
    );
  }

  lowStock(productName: string, currentStock: number) {
    return this.warning(
      'Estoque Baixo',
      `${productName} está com apenas ${currentStock} unidades`,
      {
        duration: 7000,
        sound: true,
        action: {
          label: 'Repor estoque',
          onClick: () => {
            console.log('Navegando para reposição de estoque...');
          }
        }
      }
    );
  }

  deliveryUpdate(orderNumber: string, status: string) {
    return this.info(
      'Atualização de Entrega',
      `Pedido #${orderNumber}: ${status}`,
      {
        duration: 6000,
        sound: true,
        action: {
          label: 'Acompanhar',
          onClick: () => {
            console.log('Navegando para acompanhamento...');
          }
        }
      }
    );
  }

  // Personalizar configurações de som
  setSoundConfig(config: Partial<typeof this.soundConfig>) {
    this.soundConfig = { ...this.soundConfig, ...config };
    console.log('Configurações de som atualizadas:', this.soundConfig);
    
    // Aplicar configurações ao elemento de áudio
    if (this.notificationSound) {
      this.notificationSound.volume = this.soundConfig.volume;
      this.notificationSound.playbackRate = this.soundConfig.playbackRate;
      this.notificationSound.loop = this.soundConfig.loop;
    }
  }

  // Obter configurações atuais de som
  getSoundConfig() {
    return { ...this.soundConfig };
  }

  // Sons pré-configurados
  setNotificationSound(type: 'default' | 'gentle' | 'alert' | 'chime' | 'beep') {
    const presets = {
      default: { volume: 0.5, playbackRate: 1.0, loop: false },
      gentle: { volume: 0.3, playbackRate: 0.8, loop: false },
      alert: { volume: 0.7, playbackRate: 1.2, loop: false },
      chime: { volume: 0.4, playbackRate: 1.0, loop: true },
      beep: { volume: 0.6, playbackRate: 1.5, loop: false }
    };
    
    this.setSoundConfig(presets[type]);
  }

  // Verificar status do serviço
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasAudio: !!this.audioContext,
      hasSound: !!this.notificationSound,
      browserNotifications: 'Notification' in window ? Notification.permission : 'not_supported',
      soundConfig: this.soundConfig,
      audioFile: this.notificationSound ? 'new-notification-09-352705.mp3' : 'Não carregado'
    };
  }

  // Teste de notificação
  test() {
    const status = this.getStatus();
    console.log('Status do serviço de notificações da farmácia:', status);
    
    return this.info(
      'Teste de Notificação',
      `Sistema de notificações da Vitalis Farmácia funcionando! 🎉\nStatus: ${status.isInitialized ? '✅ Ativo' : '❌ Inativo'}`,
      {
        duration: 4000,
        sound: true
      }
    );
  }
}

// Instância singleton
export const notificationService = new NotificationService();
export default notificationService;