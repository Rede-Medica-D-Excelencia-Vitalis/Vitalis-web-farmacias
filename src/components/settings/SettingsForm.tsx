
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  Bell, 
  Moon, 
  Sun, 
  Palette, 
  Volume2, 
  Languages, 
  MonitorSmartphone 
} from 'lucide-react';

const SettingsForm = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    notificationsEnabled: true,
    soundsEnabled: true,
    language: 'pt-BR',
    autoRefresh: true,
  });
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({ ...settings, [name]: checked });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setSettings({ ...settings, [name]: value });
  };
  
  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="general">Geral</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {settings.theme === 'light' ? (
                    <Sun className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <Label className="text-base">Tema</Label>
                    <p className="text-sm text-gray-500">Escolha entre tema claro ou escuro</p>
                  </div>
                </div>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleSelectChange('theme', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-base">Tamanho da fonte</Label>
                    <p className="text-sm text-gray-500">Ajuste o tamanho do texto</p>
                  </div>
                </div>
                <Select 
                  value={settings.fontSize} 
                  onValueChange={(value) => handleSelectChange('fontSize', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeno</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-base">Notificações</Label>
                    <p className="text-sm text-gray-500">Receba alertas sobre novos pedidos</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('notificationsEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-base">Sons</Label>
                    <p className="text-sm text-gray-500">Reproduzir sons para eventos importantes</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.soundsEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('soundsEnabled', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-base">Idioma</Label>
                    <p className="text-sm text-gray-500">Selecione o idioma da interface</p>
                  </div>
                </div>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MonitorSmartphone className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-base">Atualização automática</Label>
                    <p className="text-sm text-gray-500">Atualizar dados automaticamente</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => handleSwitchChange('autoRefresh', checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
