
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { storeInfo as initialStoreInfo } from '@/lib/data';
import { StoreInfo } from '@/types';
import { Clock, MapPin, Phone, Mail, Store } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const StoreSettings = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(initialStoreInfo);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreInfo({ ...storeInfo, [name]: value });
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreInfo({
      ...storeInfo,
      openingHours: {
        ...storeInfo.openingHours,
        [name]: value
      }
    });
  };
  
  const handleStoreStatusChange = (checked: boolean) => {
    setStoreInfo({ ...storeInfo, isOpen: checked });
    toast({
      title: checked ? "Farmácia Aberta" : "Farmácia Fechada",
      description: checked 
        ? "A farmácia agora está aberta para novos pedidos." 
        : "A farmácia agora está fechada para novos pedidos.",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Informações salvas",
      description: "As informações da farmácia foram atualizadas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Farmácia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Dados da Farmácia</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Farmácia</Label>
              <Input 
                id="name" 
                name="name" 
                value={storeInfo.name} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={storeInfo.email} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={storeInfo.phone} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                name="address" 
                value={storeInfo.address} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Horário de Funcionamento</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="open">Horário de Abertura</Label>
              <Input 
                id="open" 
                name="open" 
                type="time" 
                value={storeInfo.openingHours.open} 
                onChange={handleTimeChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="close">Horário de Fechamento</Label>
              <Input 
                id="close" 
                name="close" 
                type="time" 
                value={storeInfo.openingHours.close} 
                onChange={handleTimeChange} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="store-status" 
              checked={storeInfo.isOpen}
              onCheckedChange={handleStoreStatusChange}
            />
            <Label htmlFor="store-status">
              {storeInfo.isOpen ? 'Farmácia Aberta' : 'Farmácia Fechada'}
            </Label>
          </div>
        </div>
        
        <Button className="w-full md:w-auto" onClick={handleSave}>
          Salvar Informações
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreSettings;
