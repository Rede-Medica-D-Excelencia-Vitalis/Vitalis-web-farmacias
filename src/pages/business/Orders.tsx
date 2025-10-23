/**
 * Página de Pedidos
 * 
 * Este arquivo contém:
 * 1. Lista de pedidos atuais e históricos
 * 2. Gerenciamento de status dos pedidos
 * 3. Detalhes dos pedidos
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter,
  Loader2,
  MapPin,
  User,
  Calendar,
  Coins,
  Package,
  Truck
} from 'lucide-react';
import { apiService, Pedido } from '@/lib/api';
import { integrationService, IntegratedOrder } from '@/lib/integration';
import { notificationService } from '@/services/notifications/notificationService';

const Orders = () => {
  const [pedidos, setPedidos] = useState<IntegratedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [detalhePedido, setDetalhePedido] = useState<Pedido | null>(null);
  const [rastreamentoPedido, setRastreamentoPedido] = useState<Pedido | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedPedidoForStatus, setSelectedPedidoForStatus] = useState<Pedido | null>(null);
  const [novoStatus, setNovoStatus] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');
  
  // Ref para controlar o intervalo de refresh automático
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousPedidosCount = useRef<number>(0);

  // Carregar pedidos
  const carregarPedidos = async (silencioso: boolean = false) => {
    try {
      // Apenas mostra loading na primeira carga
      if (!silencioso) {
        setLoading(true);
      }
      
      const user = apiService.auth.getCurrentUser();
      if (!currentUser) {
        setCurrentUser(user);
      }
      
      console.log('🔍 Debug - Usuário logado:', user);
      
      let novosPedidos: IntegratedOrder[] = [];
      
      if (user && user.tipo_usuario === 'farmacia') {
        console.log('🔍 Debug - Buscando pedidos para farmácia ID:', user.id);
        
        // Usar o novo endpoint para buscar todos os pedidos
        try {
          const todosPedidos = await apiService.dashboard.getTodosPedidos();
          console.log('🔍 Debug - Todos os pedidos recebidos:', todosPedidos);
          
          if (todosPedidos && todosPedidos.pedidos) {
            // Converter o formato dos pedidos para o formato esperado pelo componente
            novosPedidos = todosPedidos.pedidos.map(pedido => ({
              id: pedido.id,
              numero_pedido: pedido.numero_pedido,
              farmacia_id: user.id,
              paciente_id: 0,
              total: pedido.total,
              subtotal: pedido.total,
              taxa_entrega: 0,
              desconto: 0,
              status: pedido.status,
              endereco_entrega: pedido.endereco_formatado || 'Endereço não informado',
              forma_pagamento: pedido.forma_pagamento || 'Não informado',
              observacoes_entrega: pedido.observacoes_entrega || '',
              data_criacao: pedido.criado_em,
              data_atualizacao: pedido.criado_em,
              farmacia_nome: user.nome,
              paciente_nome: pedido.paciente_nome,
              paciente_telefone: '',
              itens: []
            }));
            
            console.log('🔍 Debug - Pedidos convertidos:', novosPedidos);
          }
        } catch (error) {
          console.log('🔍 Debug - Erro ao buscar todos os pedidos:', error);
          const data = await apiService.pedidos.listar();
          novosPedidos = data;
        }
      } else {
        console.log('🔍 Debug - Usando API local');
        const data = await apiService.pedidos.listar();
        novosPedidos = data;
      }
      
      // Detectar novos pedidos e notificar (apenas em refresh silencioso)
      if (silencioso && novosPedidos.length > previousPedidosCount.current && previousPedidosCount.current > 0) {
        const qtdNovos = novosPedidos.length - previousPedidosCount.current;
        console.log(`🔔 ${qtdNovos} novo(s) pedido(s) detectado(s)!`);
        
        // Tocar som de notificação da farmácia
        if (qtdNovos === 1) {
          const novoPedido = novosPedidos[0];
          notificationService.newOrder(
            novoPedido.numero_pedido || `#${novoPedido.id}`,
            novoPedido.paciente_nome || 'Cliente'
          );
        } else {
          notificationService.info(
            'Novos Pedidos Recebidos',
            `${qtdNovos} novos pedidos foram recebidos!`,
            { 
              sound: true, 
              usePharmacySound: true,
              duration: 6000 
            }
          );
        }
      }
      
      previousPedidosCount.current = novosPedidos.length;
      setPedidos(novosPedidos);
      
    } catch (error) {
      if (!silencioso) {
        toast.error('Erro ao carregar pedidos');
      }
      console.error('Erro:', error);
    } finally {
      if (!silencioso) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, [selectedStatus]);

  // Refresh automático silencioso a cada 10 segundos
  useEffect(() => {
    console.log('✅ Refresh automático ativado - Atualizando pedidos a cada 10 segundos');
    
    // Configurar intervalo de 10 segundos
    intervalRef.current = setInterval(() => {
      console.log('🔄 Atualizando pedidos automaticamente (silencioso)...');
      carregarPedidos(true); // true = silencioso, não mostra loading
    }, 10000); // 10 segundos

    // Cleanup: limpar intervalo quando componente desmontar
    return () => {
      if (intervalRef.current) {
        console.log('⏸️ Limpando intervalo de refresh automático');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchesSearch = 
      (pedido.numero_pedido?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (pedido.paciente_nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (pedido.farmacia_nome?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' || pedido.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Atualizar status do pedido
  const atualizarStatus = async () => {
    if (!selectedPedidoForStatus || !novoStatus) return;

    try {
      await apiService.pedidos.atualizarStatus(selectedPedidoForStatus.id, novoStatus, observacoes);
      toast.success('Status atualizado com sucesso!');
      setIsStatusModalOpen(false);
      setSelectedPedidoForStatus(null);
      setNovoStatus('');
      setObservacoes('');
      carregarPedidos();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error('Erro:', error);
    }
  };

  // Cancelar pedido
  const cancelarPedido = async (pedido: Pedido) => {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        await apiService.pedidos.cancelar(pedido.id, 'Cancelado pelo gestor');
        toast.success('Pedido cancelado com sucesso!');
        carregarPedidos();
      } catch (error) {
        toast.error('Erro ao cancelar pedido');
        console.error('Erro:', error);
      }
    }
  };

  // Configurações de status
  const statusFiltro = ['todos', 'pendente', 'aceito', 'rejeitado', 'em_entrega', 'entregue'];
  
  const statusCores = {
    'pendente': 'bg-yellow-100 text-yellow-800',
    'aceito': 'bg-blue-100 text-blue-800',
    'rejeitado': 'bg-red-100 text-red-800',
    'em_entrega': 'bg-orange-100 text-orange-800',
    'entregue': 'bg-green-100 text-green-800',
  };

  const statusIcone = {
    'pendente': <Clock className="h-3 w-3" />,
    'aceito': <Package className="h-3 w-3" />,
    'rejeitado': <XCircle className="h-3 w-3" />,
    'em_entrega': <MapPin className="h-3 w-3" />,
    'entregue': <CheckCircle className="h-3 w-3" />,
  };

  const statusBorda = {
    'pendente': 'border-l-4 border-yellow-400',
    'aceito': 'border-l-4 border-blue-400',
    'rejeitado': 'border-l-4 border-red-400',
    'em_entrega': 'border-l-4 border-orange-400',
    'entregue': 'border-l-4 border-green-400',
  };

  // Estatísticas
  const estatisticas = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'pendente').length,
    concluidos: pedidos.filter(p => p.status === 'entregue').length,
    cancelados: pedidos.filter(p => p.status === 'rejeitado').length,
  };

  // Adicionar função auxiliar para atualizar status
  const atualizarStatusPedido = async (pedido: Pedido, novoStatus: string) => {
    try {
      await apiService.pedidos.atualizarStatus(pedido.id, novoStatus, '');
      toast.success(`Pedido ${novoStatus === 'aceito' ? 'aceito' : 'recusado'} com sucesso!`);
      carregarPedidos();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error('Erro:', error);
    }
  };

  // Função para solicitar motoboy
  const solicitarMotoboy = async (pedido: Pedido) => {
    try {
      // Atualizar status para "em_entrega"
      await apiService.pedidos.atualizarStatus(pedido.id, 'em_entrega', 'Motoboy solicitado');
      toast.success('Motoboy solicitado com sucesso! Pedido em entrega.');
      carregarPedidos();
    } catch (error) {
      toast.error('Erro ao solicitar motoboy');
      console.error('Erro:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos da sua farmácia</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-blue-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-blue-700">Todos os pedidos</p>
          </CardContent>
        </Card>
        <Card className="border border-yellow-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.pendentes}</div>
            <p className="text-xs text-yellow-700">Aguardando processamento</p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.concluidos}</div>
            <p className="text-xs text-green-700">{estatisticas.total > 0 ? Math.round((estatisticas.concluidos / estatisticas.total) * 100) : 0}% do total</p>
          </CardContent>
        </Card>
        <Card className="border border-red-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Cancelados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.cancelados}</div>
            <p className="text-xs text-red-700">{estatisticas.total > 0 ? Math.round((estatisticas.cancelados / estatisticas.total) * 100) : 0}% do total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, cliente ou farmácia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusFiltro.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id} className={`flex flex-col gap-2 p-4 bg-white shadow-sm ${statusBorda[pedido.status] || ''}`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-blue-900">{pedido.numero_pedido}</div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${statusCores[pedido.status]}`}>
                  {statusIcone[pedido.status]}
                  {pedido.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-base text-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-semibold text-lg">{pedido.paciente_nome || 'Cliente'}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-base">
                    {new Date(pedido.data_criacao).toLocaleDateString('pt-BR')} às {new Date(pedido.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold text-green-700 text-lg">R$ {Number(pedido.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDetalhePedido(pedido)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Button>
                {pedido.status === 'pendente' ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="success"
                      onClick={async () => {
                        await atualizarStatusPedido(pedido, 'aceito');
                      }}
                    >
                      Aceitar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={async () => {
                        await atualizarStatusPedido(pedido, 'rejeitado');
                      }}
                    >
                      Recusar
                    </Button>
                  </>
                ) : pedido.status === 'aceito' ? (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={async () => {
                      await solicitarMotoboy(pedido);
                    }}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Solicitar Motoboy
                  </Button>
                ) : pedido.status === 'em_entrega' ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedPedidoForStatus(pedido);
                      setNovoStatus('entregue');
                      setIsStatusModalOpen(true);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Marcar como Entregue
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && pedidosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedStatus !== 'todos' 
              ? 'Tente ajustar os filtros de busca'
              : 'Ainda não há pedidos registrados'
            }
          </p>
        </div>
      )}

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={!!detalhePedido} onOpenChange={() => setDetalhePedido(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          {detalhePedido && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Número do Pedido</Label>
                  <p className="text-lg font-bold">{detalhePedido.numero_pedido}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={statusCores[detalhePedido.status]}>
                    {detalhePedido.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p>{detalhePedido.paciente_nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data de Criação</Label>
                  <p>{new Date(detalhePedido.data_criacao).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Endereço de Entrega</Label>
                <p className="text-sm text-gray-600">{detalhePedido.endereco_entrega}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Subtotal</Label>
                  <p className="font-bold">R$ {Number(detalhePedido.subtotal).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Taxa de Entrega</Label>
                  <p className="font-bold">R$ {Number(detalhePedido.taxa_entrega).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total</Label>
                  <p className="font-bold text-lg text-green-700">R$ {Number(detalhePedido.total).toFixed(2)}</p>
                </div>
              </div>

              {detalhePedido.itens && detalhePedido.itens.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Itens do Pedido</Label>
                  <div className="space-y-2 mt-2">
                    {detalhePedido.itens.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.produto_nome}</p>
                          <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                        </div>
                        <p className="font-bold">R$ {(Number(item.preco_unitario) * Number(item.quantidade)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Atualização de Status */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Status do Pedido</DialogTitle>
            <DialogDescription>
              Selecione o novo status para o pedido #{selectedPedidoForStatus?.numero_pedido}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={novoStatus === 'aceito' ? 'default' : 'outline'}
                onClick={() => setNovoStatus('aceito')}
                className="justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Aceito
              </Button>
              <Button
                variant={novoStatus === 'rejeitado' ? 'default' : 'outline'}
                onClick={() => setNovoStatus('rejeitado')}
                className="justify-start"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitado
              </Button>
              <Button
                variant={novoStatus === 'em_entrega' ? 'default' : 'outline'}
                onClick={() => setNovoStatus('em_entrega')}
                className="justify-start"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Em Entrega
              </Button>
              <Button
                variant={novoStatus === 'entregue' ? 'default' : 'outline'}
                onClick={() => setNovoStatus('entregue')}
                className="justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Entregue
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={atualizarStatus} disabled={!novoStatus}>
              Atualizar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
