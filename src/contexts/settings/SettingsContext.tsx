/**
 * Contexto de Configurações
 * 
 * Gerencia o estado global das configurações da aplicação,
 * incluindo configurações da farmácia, usuário e sistema.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface das configurações da farmácia
export interface PharmacySettings {
  name: string;
  cnpj: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  delivery: {
    enabled: boolean;
    radius: number; // em km
    fee: number;
    freeDeliveryThreshold: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    stockAlerts: boolean;
    systemAlerts: boolean;
  };
}

// Interface das configurações do usuário
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  notifications: {
    sound: boolean;
    desktop: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

// Interface das configurações do sistema
export interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
    startTime?: Date;
    endTime?: Date;
  };
  security: {
    sessionTimeout: number; // em minutos
    maxLoginAttempts: number;
    requireTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  performance: {
    cacheEnabled: boolean;
    cacheTimeout: number; // em minutos
    maxFileSize: number; // em MB
    compressionEnabled: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionDays: number;
    cloudBackup: boolean;
  };
}

// Interface do contexto
interface SettingsContextType {
  // Estado
  pharmacy: PharmacySettings;
  user: UserSettings;
  system: SystemSettings;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  loadSettings: () => Promise<void>;
  updatePharmacySettings: (settings: Partial<PharmacySettings>) => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  resetToDefaults: (type: 'pharmacy' | 'user' | 'system') => Promise<void>;
  
  // Utilitários
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportSettings: () => string;
  importSettings: (data: string) => Promise<void>;
  validateSettings: (settings: any) => boolean;
}

// Contexto
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [pharmacy, setPharmacy] = useState<PharmacySettings>({
    name: 'Farmácia Vitalis',
    cnpj: '12.345.678/0001-90',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    contact: {
      phone: '(11) 99999-9999',
      email: 'contato@farmaciavitalis.com',
    },
    businessHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '08:00', close: '12:00', closed: false },
      sunday: { open: '08:00', close: '12:00', closed: true },
    },
    delivery: {
      enabled: true,
      radius: 10,
      fee: 5.00,
      freeDeliveryThreshold: 50.00,
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      orderUpdates: true,
      stockAlerts: true,
      systemAlerts: true,
    },
  });

  const [user, setUser] = useState<UserSettings>({
    theme: 'light',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'BRL',
    notifications: {
      sound: true,
      desktop: true,
      email: true,
      sms: false,
    },
    privacy: {
      shareData: false,
      analytics: true,
      marketing: false,
    },
  });

  const [system, setSystem] = useState<SystemSettings>({
    maintenance: {
      enabled: false,
      message: 'Sistema em manutenção. Volte em breve.',
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireTwoFactor: false,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
      },
    },
    performance: {
      cacheEnabled: true,
      cacheTimeout: 5,
      maxFileSize: 5,
      compressionEnabled: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudBackup: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Carregar do localStorage primeiro
      loadFromLocalStorage();
      
      // Simular chamada à API
      // const response = await apiService.settings.getSettings();
      // const settings = response.data;
      // setPharmacy(settings.pharmacy);
      // setUser(settings.user);
      // setSystem(settings.system);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar configurações da farmácia
  const updatePharmacySettings = async (newSettings: Partial<PharmacySettings>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.settings.updatePharmacySettings(newSettings);
      
      setPharmacy(prev => ({ ...prev, ...newSettings }));
      saveToLocalStorage();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar configurações da farmácia');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar configurações do usuário
  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.settings.updateUserSettings(newSettings);
      
      setUser(prev => ({ ...prev, ...newSettings }));
      saveToLocalStorage();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar configurações do usuário');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar configurações do sistema
  const updateSystemSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.settings.updateSystemSettings(newSettings);
      
      setSystem(prev => ({ ...prev, ...newSettings }));
      saveToLocalStorage();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar configurações do sistema');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resetar para padrões
  const resetToDefaults = async (type: 'pharmacy' | 'user' | 'system') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular chamada à API
      // await apiService.settings.resetSettings(type);
      
      // Recarregar configurações padrão
      await loadSettings();
    } catch (err: any) {
      setError(err.message || 'Erro ao resetar configurações');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar no localStorage
  const saveToLocalStorage = () => {
    try {
      const settings = { pharmacy, user, system };
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações no localStorage:', error);
    }
  };

  // Carregar do localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.pharmacy) setPharmacy(settings.pharmacy);
        if (settings.user) setUser(settings.user);
        if (settings.system) setSystem(settings.system);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do localStorage:', error);
    }
  };

  // Exportar configurações
  const exportSettings = (): string => {
    const settings = { pharmacy, user, system };
    return JSON.stringify(settings, null, 2);
  };

  // Importar configurações
  const importSettings = async (data: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const settings = JSON.parse(data);
      
      if (validateSettings(settings)) {
        if (settings.pharmacy) setPharmacy(settings.pharmacy);
        if (settings.user) setUser(settings.user);
        if (settings.system) setSystem(settings.system);
        
        saveToLocalStorage();
      } else {
        throw new Error('Formato de configurações inválido');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao importar configurações');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Validar configurações
  const validateSettings = (settings: any): boolean => {
    return (
      settings &&
      typeof settings === 'object' &&
      (settings.pharmacy || settings.user || settings.system)
    );
  };

  // Salvar automaticamente quando as configurações mudarem
  useEffect(() => {
    saveToLocalStorage();
  }, [pharmacy, user, system]);

  // Carregar configurações na inicialização
  useEffect(() => {
    loadSettings();
  }, []);

  const value: SettingsContextType = {
    pharmacy,
    user,
    system,
    isLoading,
    error,
    loadSettings,
    updatePharmacySettings,
    updateUserSettings,
    updateSystemSettings,
    resetToDefaults,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportSettings,
    importSettings,
    validateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook personalizado
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
};
