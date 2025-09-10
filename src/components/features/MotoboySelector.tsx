import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  MessageCircle, 
  Truck, 
  User, 
  Loader2,
  Search,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motoboyIntegrationService, Motoboy, Entrega } from '@/lib/motoboyIntegration';

interface MotoboySelectorProps {
  pedidoId: number;
  enderecoEntrega: string;
  onMotoboySelecionado: (motoboy: Motoboy, entrega: Entrega) => void;
  onCancelar: () => void;
}

export const MotoboySelector: React.FC<MotoboySelectorProps> = ({
  pedidoId,
  enderecoEntrega,
  onMotoboySelecionado,
  onCancelar
}) => {
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [selectedMotoboy, setSelectedMotoboy] = useState<Motoboy | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Carregar motoboys disponíveis
  useEffect(() => {
    carregarMotoboys();
  }, []);

  const carregarMotoboys = async () => {
    try {
      setLoading(true);
      const motoboysDisponiveis = await motoboyIntegrationService.listarMotoboysDisponiveis();
      setMotoboys(motoboysDisponiveis);
    } catch (error: any) {
      console.error('Erro ao carregar motoboys:', error);
      toast.error('Erro ao carregar motoboys disponíveis');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar motoboys
  const motoboysFiltrados = motoboys.filter(motoboy => {
    const matchesSearch = motoboy.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         motoboy.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'todos' ||
                         (selectedFilter === 'online' && motoboy.status_online) ||
                         (selectedFilter === 'melhor-avaliados' && motoboy.avaliacao_media >= 4.5);

    return matchesSearch && matchesFilter;
  });

  // Selecionar motoboy
  const handleMotoboySelect = (motoboy: Motoboy) => {
    setSelectedMotoboy(motoboy);
    setIsAssignDialogOpen(true);
  };

  // Atribuir entrega ao motoboy
  const handleAssignEntrega = async () => {
    if (!selectedMotoboy) return;

    try {
      setAssigning(true);
      
      // Criar entrega
      const entrega: Entrega = {
        id: 0, // Será definido pelo backend
        pedido_id: pedidoId,
        motoboy_id: selectedMotoboy.id,
        status: 'aceita',
        endereco_origem: 'Farmacia Vitalis', // Endereço da farmácia
        endereco_destino: enderecoEntrega,
        distancia_km: 0, // Será calculado pelo backend
        tempo_estimado_minutos: 30, // Estimativa padrão
        taxa_entrega: 0, // Será definida pelo backend
        comissao_motoboy: 0, // Será calculada pelo backend
        data_criacao: new Date().toISOString(),
        data_aceitacao: new Date().toISOString(),
        observacoes: observacoes.trim() || undefined
      };

      // Chamar callback com motoboy e entrega selecionados
      onMotoboySelecionado(selectedMotoboy, entrega);
      
      toast.success(`Entrega atribuída ao motoboy ${selectedMotoboy.nome}`);
      setIsAssignDialogOpen(false);
      setSelectedMotoboy(null);
      setObservacoes('');
      
    } catch (error: any) {
      console.error('Erro ao atribuir entrega:', error);
      toast.error('Erro ao atribuir entrega ao motoboy');
    } finally {
      setAssigning(false);
    }
  };

  // Calcular tempo estimado de entrega
  const calcularTempoEntrega = (motoboy: Motoboy) => {
    // Lógica simples baseada na avaliação e experiência
    const tempoBase = 20; // minutos
    const bonusExperiencia = Math.min(motoboy.total_entregas / 100, 10); // máximo 10 min de bonus
    const bonusAvaliacao = motoboy.avaliacao_media >= 4.5 ? 5 : 0;
    
    return Math.max(tempoBase - bonusExperiencia - bonusAvaliacao, 10);
  };

  // Formatar avaliação
  const formatarAvaliacao = (avaliacao: number) => {
    return avaliacao.toFixed(1);
  };

  // Formatar total de entregas
  const formatarTotalEntregas = (total: number) => {
    if (total >= 1000) {
      return `${(total / 1000).toFixed(1)}k`;
    }
    return total.toString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando motoboys disponíveis...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Selecionar Motoboy</h3>
          <p className="text-sm text-gray-600">
            Escolha um motoboy disponível para realizar a entrega
          </p>
        </div>
        <Button variant="outline" onClick={onCancelar}>
          <XCircle className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar motoboy por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os motoboys</SelectItem>
            <SelectItem value="online">Apenas online</SelectItem>
            <SelectItem value="melhor-avaliados">Melhor avaliados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de motoboys */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {motoboysFiltrados.map((motoboy) => (
          <Card 
            key={motoboy.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleMotoboySelect(motoboy)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${motoboy.nome}&background=3B82F6&color=fff`} />
                    <AvatarFallback>{motoboy.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{motoboy.nome}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={motoboy.status_online ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {motoboy.status_online ? 'Online' : 'Offline'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {motoboy.status_conta}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {formatarAvaliacao(motoboy.avaliacao_media)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatarTotalEntregas(motoboy.total_entregas)} entregas
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                {/* Informações de contato */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{motoboy.telefone}</span>
                </div>
                
                {/* Veículos */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>
                    {motoboy.veiculos.filter(v => v.ativo).map(v => v.tipo).join(', ')}
                  </span>
                </div>

                {/* Tempo estimado */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    ~{calcularTempoEntrega(motoboy)} min
                  </span>
                </div>

                {/* Localização */}
                {motoboy.localizacao && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">
                      Atualizado há {Math.round((Date.now() - new Date(motoboy.localizacao.ultima_atualizacao).getTime()) / 60000)} min
                    </span>
                  </div>
                )}
              </div>

              {/* Botão de seleção */}
              <Button 
                className="w-full mt-3" 
                disabled={!motoboy.status_online}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Selecionar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há motoboys */}
      {motoboysFiltrados.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum motoboy encontrado
            </h4>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedFilter !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há motoboys disponíveis no momento'
              }
            </p>
            <Button variant="outline" onClick={carregarMotoboys}>
              <Loader2 className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog de atribuição */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Atribuir Entrega</DialogTitle>
            <DialogDescription>
              Confirme os detalhes da entrega para {selectedMotoboy?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Detalhes do motoboy */}
            {selectedMotoboy && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedMotoboy.nome}&background=3B82F6&color=fff`} />
                  <AvatarFallback>{selectedMotoboy.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMotoboy.nome}</p>
                  <p className="text-sm text-gray-600">
                    Avaliação: {formatarAvaliacao(selectedMotoboy.avaliacao_media)} ⭐
                  </p>
                </div>
              </div>
            )}

            {/* Endereço de entrega */}
            <div>
              <Label htmlFor="endereco">Endereço de Entrega</Label>
              <Input
                id="endereco"
                value={enderecoEntrega}
                disabled
                className="mt-1"
              />
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Instruções especiais para a entrega..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAssignDialogOpen(false)}
              disabled={assigning}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAssignEntrega}
              disabled={assigning}
            >
              {assigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atribuindo...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Atribuição
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MotoboySelector;
