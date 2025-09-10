/**
 * Página de Configurações
 * 
 * Este arquivo contém:
 * 1. Configurações gerais do sistema
 * 2. Preferências de notificações
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Bell } from 'lucide-react';
import NotificationDemo from '@/components/notifications/NotificationDemo';

/**
 * Componente da página de configurações
 * 
 * @returns JSX.Element - Página de configurações com diferentes seções
 */
const SettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Idioma</Label>
              <p className="text-sm text-muted-foreground">
                Selecione o idioma preferido
              </p>
            </div>
            <Input className="w-40" defaultValue="Português" />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações de Pedidos</Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas sobre novos pedidos
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Demonstração de Notificações */}
      <NotificationDemo />
    </div>
  );
};

export default SettingsPage;
