import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Truck, 
  Loader2,
  Navigation,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Star
} from 'lucide-react';
import { motoboyIntegrationService, Entrega, Motoboy, PedidoComEntrega } from '@/lib/motoboyIntegration';

interface EntregaTrackerProps {
  pedidoId: number;
  onStatusUpdate?: (novoStatus: string) => void;
}

export const EntregaTracker: React.FC<EntregaTrackerProps> = ({
  pedidoId,
  onStatusUpdate
}) => {
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [pedido, setPedido] = useState<PedidoComEntrega | null>(null);
  const [motoboy, setMotoboy] = useState<Motoboy | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [rastreamento, setRastreamento] = useState<any>(null);

  // Carregar dados da entrega
  useEffect(() => {
    carregarEntrega();
  }, [pedidoId]);

  // Atualizar rastreamento em tempo real
  useEffect(() => {
    if (entrega && entrega.status === 'em_rota') {
      const interval = setInterval(() => {
        atualizarRastreamento();
      }, 30000); // Atualizar a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [entrega]);

  const carregarEntrega = async () => {
    try {
      setLoading(true);
      const pedidoComEntrega = await motoboyIntegrationService.buscarPedidoComEntrega(pedidoId);
      setPedido(pedidoComEntrega);
      
      if (pedidoComEntrega.entrega) {
        setEntrega(pedidoComEntrega.entrega);
        
        if (pedidoComEntrega.entrega.motoboy_id && pedidoComEntrega.motoboy) {
          setMotoboy(pedidoComEntrega.motoboy);
        }
      }
    } catch (error: any) {
      console.error('Erro ao carregar entrega:', error);
      toast.error('Erro ao carregar dados da entrega');
    } finally {
      setLoading(false);
    }
  };

  const atualizarRastreamento = async () => {
    if (!entrega) return;

    try {
      const dadosRastreamento = await motoboyIntegrationService.rastrearEntrega(entrega.id);
      setRastreamento(dadosRastreamento);
    } catch (error) {
      console.error('Erro ao atualizar rastreamento:', error);
    }
  };

  const atualizarStatusEntrega = async (novoStatus: string, observacoes?: string) => {
    if (!entrega) return;

    try {
      setUpdating(true);
      const entregaAtualizada = await motoboyIntegrationService.atualizarStatusEntrega(
        entrega.id,
        novoStatus,
        observacoes
      );
      
      setEntrega(entregaAtualizada);
      
      if (onStatusUpdate) {
        onStatusUpdate(novoStatus);
      }
      
      toast.success(`Status da entrega atualizado para: ${novoStatus}`);
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da entrega');
    } finally {
      setUpdating(false);
    }
  };

  const cancelarEntrega = async (motivo: string) => {
    if (!entrega) return;

    try {
      setUpdating(true);
      await motoboyIntegrationService.cancelarEntrega(entrega.id, motivo);
      
      setEntrega(prev => prev ? { ...prev, status: 'cancelada' } : null);
      
      if (onStatusUpdate) {
        onStatusUpdate('cancelada');
      }
      
      toast.success('Entrega cancelada com sucesso');
    } catch (error: any) {
      console.error('Erro ao cancelar entrega:', error);
      toast.error('Erro ao cancelar entrega');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-gray-500';
      case 'aceita': return 'bg-blue-500';
      case 'em_rota': return 'bg-yellow-500';
      case 'entregue': return 'bg-green-500';
      case 'cancelada': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'aceita': return 'Aceita pelo Motoboy';
      case 'em_rota': return 'Em Rota';
      case 'entregue': return 'Entregue';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponivel': return <AlertCircle className="h-4 w-4" />;
      case 'aceita': return <CheckCircle className="h-4 w-4" />;
      case 'em_rota': return <Truck className="h-4 w-4" />;
      case 'entregue': return <CheckCircle className="h-4 w-4" />;
      case 'cancelada': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatarTempo = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos} min`;
    }
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  };

  const formatarDistancia = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando dados da entrega...</span>
        </CardContent>
      </Card>
    );
  }

  if (!entrega) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <Truck className="h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma entrega encontrada
          </h4>
          <p className="text-gray-600 mb-4">
            Este pedido ainda não possui uma entrega associada
          </p>
          <Button variant="outline" onClick={carregarEntrega}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card principal da entrega */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Rastreamento da Entrega</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(entrega.status)} text-white`}>
                {getStatusIcon(entrega.status)}
                <span className="ml-1">{getStatusText(entrega.status)}</span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailsOpen(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Detalhes
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status da entrega */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatarTempo(entrega.tempo_estimado_minutos)}
              </div>
              <div className="text-sm text-gray-600">Tempo Estimado</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatarDistancia(entrega.distancia_km)}
              </div>
              <div className="text-sm text-gray-600">Distância</div>
            </div>
          </div>

          {/* Informações do motoboy */}
          {motoboy && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Motoboy Responsável</h4>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${motoboy.nome}&background=3B82F6&color=fff`} />
                  <AvatarFallback>{motoboy.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{motoboy.nome}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {motoboy.avaliacao_media.toFixed(1)}
                    </span>
                    <span>{motoboy.total_entregas} entregas</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Rastreamento em tempo real */}
          {entrega.status === 'em_rota' && rastreamento && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Localização em Tempo Real</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Última atualização: {new Date(rastreamento.timestamp).toLocaleTimeString()}</p>
                {rastreamento.velocidade && (
                  <p>Velocidade: {rastreamento.velocidade} km/h</p>
                )}
              </div>
              <Button 
                className="w-full mt-3" 
                variant="outline"
                onClick={() => window.open(`https://www.google.com/maps?q=${rastreamento.latitude},${rastreamento.longitude}`, '_blank')}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Ver no Google Maps
              </Button>
            </div>
          )}

          {/* Ações baseadas no status */}
          <div className="flex space-x-2">
            {entrega.status === 'aceita' && (
              <Button 
                onClick={() => atualizarStatusEntrega('em_rota')}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Truck className="h-4 w-4 mr-2" />
                )}
                Iniciar Entrega
              </Button>
            )}
            
            {entrega.status === 'em_rota' && (
              <Button 
                onClick={() => atualizarStatusEntrega('entregue')}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Marcar como Entregue
              </Button>
            )}
            
            {['aceita', 'em_rota'].includes(entrega.status) && (
              <Button 
                variant="outline"
                onClick={() => cancelarEntrega('Cancelado pela farmácia')}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Cancelar Entrega
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de detalhes */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Entrega</DialogTitle>
            <DialogDescription>
              Informações completas sobre a entrega e o motoboy
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Detalhes da entrega */}
            <div>
              <h4 className="font-medium mb-2">Informações da Entrega</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID da Entrega:</span>
                  <span className="font-medium">#{entrega.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(entrega.status)}>
                    {getStatusText(entrega.status)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Entrega:</span>
                  <span className="font-medium">R$ {entrega.taxa_entrega.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comissão Motoboy:</span>
                  <span className="font-medium">R$ {entrega.comissao_motoboy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de Criação:</span>
                  <span className="font-medium">
                    {new Date(entrega.data_criacao).toLocaleString()}
                  </span>
                </div>
                {entrega.data_aceitacao && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data de Aceitação:</span>
                    <span className="font-medium">
                      {new Date(entrega.data_aceitacao).toLocaleString()}
                    </span>
                  </div>
                )}
                {entrega.observacoes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Observações:</span>
                    <span className="font-medium">{entrega.observacoes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Endereços */}
            <div>
              <h4 className="font-medium mb-2">Endereços</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Origem:</span>
                  <p className="font-medium">{entrega.endereco_origem}</p>
                </div>
                <div>
                  <span className="text-gray-600">Destino:</span>
                  <p className="font-medium">{entrega.endereco_destino}</p>
                </div>
              </div>
            </div>

            {/* Detalhes do motoboy */}
            {motoboy && (
              <div>
                <h4 className="font-medium mb-2">Informações do Motoboy</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{motoboy.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{motoboy.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-medium">{motoboy.telefone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status da Conta:</span>
                    <Badge variant="outline">{motoboy.status_conta}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Entregas:</span>
                    <span className="font-medium">{motoboy.total_entregas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ganhos Históricos:</span>
                    <span className="font-medium">R$ {motoboy.total_ganhos_historico.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntregaTracker;
