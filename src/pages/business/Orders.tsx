/**
 * Página de Pedidos
 * 
 * Este arquivo contém:
 * 1. Lista de pedidos atuais e históricos
 * 2. Gerenciamento de status dos pedidos
 * 3. Detalhes dos pedidos
 */

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  AlertCircle,
  Info,
  Truck
} from 'lucide-react';
import { apiService, Pedido } from '@/lib/api';
import { integrationService, IntegratedOrder, motoboyIntegrationService } from '@/lib/integration';
import { notificationService } from '@/services/notifications/notificationService';

const Orders = () => {
  const [pedidos, setPedidos] = useState<IntegratedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [detalhePedido, setDetalhePedido] = useState<Pedido | null>(null);
  const [rastreamentoPedido, setRastreamentoPedido] = useState<Pedido | null>(null);
  const [pedidosColetados, setPedidosColetados] = useState<number[]>([]);
  const [pedidoDevolucaoLoading, setPedidoDevolucaoLoading] = useState<number | null>(null);
  
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
            novosPedidos = todosPedidos.pedidos.map(pedido => {
              const entregaStatus = pedido.status_entrega || null;
              const devolucaoConfirmada = Boolean(
                (pedido as any)?.farmacia_confirmou_devolucao &&
                  Number((pedido as any)?.farmacia_confirmou_devolucao) !== 0
              ) || entregaStatus === 'devolvida';

              const motivoFormatado = formatMotivoProblemaLabel(
                pedido.motivo_problema || (pedido as any)?.motivo_problema || null
              );
              const observacaoPedido = (pedido as any)?.observacoes_pedido || pedido.observacoes_pedido || null;
              const observacaoEntrega = (pedido as any)?.observacoes_entrega ?? pedido.observacoes_entrega ?? null;
              const observacoesCombinadas = (
                devolucaoConfirmada
                  ? [
                      `Devolução confirmada pela farmácia${motivoFormatado ? ` (motivo: ${motivoFormatado})` : ''}.`,
                      observacaoEntrega,
                      observacaoPedido,
                    ]
                  : [observacaoEntrega, observacaoPedido]
              )
                .filter(Boolean)
                .join('\n') || '';

              return {
                id: pedido.id,
                numero_pedido: pedido.numero_pedido,
                farmacia_id: pedido.farmacia_id ?? user.farmacia_id ?? user.id,
                paciente_id: 0,
                total: pedido.total,
                subtotal: pedido.total,
                taxa_entrega: 0,
                desconto: 0,
                status: pedido.status,
                status_entrega: devolucaoConfirmada ? 'devolvida' : entregaStatus,
                endereco_entrega: pedido.endereco_formatado || 'Endereço não informado',
                forma_pagamento: pedido.forma_pagamento || 'Não informado',
                observacoes_entrega: observacoesCombinadas,
                data_criacao: pedido.criado_em,
                data_atualizacao: pedido.criado_em,
                farmacia_nome: user.nome,
                paciente_nome: pedido.paciente_nome,
                paciente_telefone: '',
                itens: [],
                entrega_id: pedido.entrega_id ?? null,
                codigo_confirmacao: pedido.codigo_confirmacao ?? null,
                devolucao_confirmada: devolucaoConfirmada,
                motivo_problema: motivoFormatado,
              };
            });

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
      
      novosPedidos = novosPedidos.map((pedido) => {
        const entregaStatus = (pedido as any).status_entrega ?? pedido.status_entrega ?? null;
        const devolucaoConfirmada = Boolean(
          (pedido as any).devolucao_confirmada ??
            ((pedido as any).farmacia_confirmou_devolucao &&
              Number((pedido as any).farmacia_confirmou_devolucao) !== 0)
        ) || entregaStatus === 'devolvida';
        const motivoFormatado = formatMotivoProblemaLabel(
          (pedido as any).motivo_problema ?? pedido.motivo_problema ?? null
        );
        const observacaoPedido = (pedido as any).observacoes_pedido ?? pedido.observacoes_pedido ?? null;
        const observacaoEntrega = (pedido as any).observacoes_entrega ?? pedido.observacoes_entrega ?? null;
        const observacoesCombinadas = [
          devolucaoConfirmada
            ? `Devolução confirmada pela farmácia${motivoFormatado ? ` (motivo: ${motivoFormatado})` : ''}.`
            : null,
          observacaoEntrega,
          observacaoPedido,
        ]
          .filter(Boolean)
          .join('\n') || '';

        return {
          ...pedido,
          entrega_id: (pedido as any).entrega_id ?? pedido.entrega_id ?? null,
          codigo_confirmacao: (pedido as any).codigo_confirmacao ?? pedido.codigo_confirmacao ?? null,
          status_entrega: devolucaoConfirmada ? 'devolvida' : entregaStatus,
          devolucao_confirmada: devolucaoConfirmada,
          motivo_problema: motivoFormatado,
          observacoes_entrega: observacoesCombinadas,
        };
      });

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
            notificationService.info('Novos Pedidos Recebidos', `${qtdNovos} novos pedidos foram recebidos!`, {
              sound: true,
              duration: 6000,
            });
        }
      }
      
      previousPedidosCount.current = novosPedidos.length;
      setPedidos(novosPedidos);
      setPedidosColetados((prev) => {
        const pedidosIds = novosPedidos.map((pedido) => pedido.id);
        const coletadosBackend = novosPedidos
          .filter((pedido) => pedido.status_entrega === 'coletado')
          .map((pedido) => pedido.id);
        const ativosPrev = prev.filter((id) => pedidosIds.includes(id));
        return Array.from(new Set([...ativosPrev, ...coletadosBackend]));
      });
      
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
  const statusFiltro = ['todos', 'pendente', 'aceito', 'em_entrega', 'entregue', 'cancelado'];

  const formatMotivoProblemaLabel = (motivo?: string | null) => {
    if (!motivo) return null;
    return motivo
      .toString()
      .split('_')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const statusCores = {
    'pendente': 'bg-yellow-100 text-yellow-800',
    'aceito': 'bg-blue-100 text-blue-800',
    'rejeitado': 'bg-red-100 text-red-800',
    'em_entrega': 'bg-orange-100 text-orange-800',
    'entregue': 'bg-green-100 text-green-800',
    'devolvido': 'bg-yellow-100 text-yellow-800',
  };

  const statusIcone = {
    'pendente': <Clock className="h-3 w-3" />,
    'aceito': <Package className="h-3 w-3" />,
    'rejeitado': <XCircle className="h-3 w-3" />,
    'em_entrega': <MapPin className="h-3 w-3" />,
    'entregue': <CheckCircle className="h-3 w-3" />,
    'devolvido': <Package className="h-3 w-3" />,
  };

  const statusBorda = {
    'pendente': 'border-l-4 border-yellow-400',
    'aceito': 'border-l-4 border-blue-400',
    'rejeitado': 'border-l-4 border-red-400',
    'em_entrega': 'border-l-4 border-orange-400',
    'entregue': 'border-l-4 border-green-400',
    'devolvido': 'border-l-4 border-yellow-400',
  };

  // Estatísticas
  const estatisticas = {
    total: pedidos.length,
    pendentes: pedidos.filter(p => p.status === 'pendente').length,
    concluidos: pedidos.filter(p => p.status === 'entregue').length,
    cancelados: pedidos.filter(p => p.status === 'rejeitado').length,
  };

  const aceitarPedido = async (pedido: Pedido) => {
    try {
      await apiService.pedidos.atualizarStatus(pedido.id, 'aceito', '');
      toast.success('Pedido aceito com sucesso!');
      carregarPedidos();
    } catch (error) {
      toast.error('Erro ao aceitar pedido');
      console.error('Erro:', error);
    }
  };

  const recusarPedido = async (pedido: Pedido) => {
    try {
      await apiService.pedidos.atualizarStatus(pedido.id, 'rejeitado', '');
      toast.success('Pedido recusado com sucesso!');
      carregarPedidos();
    } catch (error) {
      toast.error('Erro ao recusar pedido');
      console.error('Erro:', error);
    }
  };

  const confirmarProdutoEntregueAoMotoboy = async (pedido: Pedido) => {
    try {
      await apiService.entregas.confirmarColetaPorPedido(pedido.id);
      toast.success('Produto entregue ao motoboy!');
      setPedidosColetados((prev) => (prev.includes(pedido.id) ? prev : [...prev, pedido.id]));
      carregarPedidos(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const mensagemApi =
          (error.response.data as { erro?: string; mensagem?: string })?.erro ??
          (error.response.data as { erro?: string; mensagem?: string })?.mensagem;

        toast.info(mensagemApi || 'Nenhuma entrega ativa foi encontrada para este pedido. Aguarde o motoboy aceitar a corrida.');
      } else {
        toast.error('Erro ao confirmar entrega ao motoboy');
      }
      console.error('Erro:', error);
    }
  };

  const confirmarDevolucaoEntrega = async (pedido: IntegratedOrder) => {
    if (!pedido.entrega_id) {
      toast.error('Não foi possível localizar a entrega vinculada a este pedido.');
      return;
    }

    const entregaId = Number(pedido.entrega_id);
    if (!Number.isFinite(entregaId)) {
      toast.error('Identificador da entrega inválido.');
      return;
    }

    const confirmar = window.confirm(
      'Confirmar devolução significa que o produto retornou para a farmácia. Deseja continuar?'
    );

    if (!confirmar) {
      return;
    }

    try {
      setPedidoDevolucaoLoading(pedido.id);
      await motoboyIntegrationService.confirmarDevolucao(entregaId);
      toast.success('Devolução confirmada com sucesso!');
      await carregarPedidos(true);
    } catch (error) {
      console.error('Erro ao confirmar devolução:', error);
      toast.error('Erro ao confirmar devolução');
    } finally {
      setPedidoDevolucaoLoading(null);
    }
  };

  // Função para solicitar motoboy
  const solicitarMotoboy = async (pedido: Pedido) => {
    try {
      const user = currentUser ?? apiService.auth.getCurrentUser();
      const farmaciaPersistida = apiService.auth.getFarmaciaAtual?.();

      if (!user) {
        toast.error('Não foi possível identificar a farmácia. Faça login novamente.');
        console.error('❌ [Orders.solicitarMotoboy] Usuário não encontrado no localStorage');
        return;
      }

      const farmaciaId =
        (pedido as any)?.farmacia_id ??
        (pedido as IntegratedOrder)?.farmacia_id ??
        (user as any)?.farmacia_id ??
        user.id;

      console.log('🚀 [Orders.solicitarMotoboy] Iniciando solicitação de motoboy', {
        pedidoId: pedido.id,
        numeroPedido: (pedido as any)?.identificador ?? pedido.numero_pedido ?? pedido.id,
        statusAtual: pedido.status,
        farmaciaIdCalculado: farmaciaId
      });

      const solicitacaoPayload = {
        farmacia_id: farmaciaPersistida?.id ?? farmaciaId,
        pedido_id: pedido.id,
        valor_entrega: (pedido as any)?.valorEntrega ?? pedido.taxa_entrega ?? 0,
        observacoes: 'Motoboy solicitado',
        urgente: false,
      };

      const solicitacaoResponse = await apiService.entregas.solicitarMotoboy(solicitacaoPayload);

      console.log('✅ [Orders.solicitarMotoboy] Solicitação enviada para motoboys', solicitacaoResponse);

      // Atualizar status para "em_entrega"
      await apiService.pedidos.atualizarStatus(pedido.id, 'em_entrega', 'Motoboy solicitado');
      console.log('✅ [Orders.solicitarMotoboy] Status atualizado para em_entrega', {
        pedidoId: pedido.id
      });

      toast.success('Motoboy solicitado com sucesso! Pedido em entrega.');
      carregarPedidos();
    } catch (error) {
      let mensagemErro = 'Erro ao solicitar motoboy';

      if (axios.isAxiosError(error)) {
        const mensagemApi =
          (error.response?.data as { erro?: string; mensagem?: string })?.erro ??
          (error.response?.data as { erro?: string; mensagem?: string })?.mensagem;

        if (mensagemApi) {
          mensagemErro = mensagemApi;
        } else if (error.response?.status === 404) {
          mensagemErro = 'Nenhum motoboy disponível no momento. Tente novamente em instantes.';
        }
      }

      toast.error(mensagemErro);
      console.error('❌ [Orders.solicitarMotoboy] Erro ao solicitar motoboy:', error);
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
            <CardTitle className="text-sm font-medium">Pedidos Rejeitados</CardTitle>
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
          {pedidosFiltrados.map((pedido) => {
            const statusPrincipal = pedido.devolucao_confirmada ? 'devolvido' : pedido.status;
            const badgeClasse = statusCores[statusPrincipal] || 'bg-gray-100 text-gray-700';
            const statusIconeElemento = statusIcone[statusPrincipal] || <Info className="h-3 w-3" />;

            return (
              <Card
                key={pedido.id}
                className={`flex h-full flex-col justify-between bg-white p-4 shadow-sm ${statusBorda[statusPrincipal] || ''}`}
              >
                <CardContent className="flex flex-1 flex-col gap-2 p-0">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-900">{pedido.numero_pedido}</div>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${badgeClasse}`}>
                      {statusIconeElemento}
                      {statusPrincipal.replace('_', ' ')}
                    </span>
                  </div>
                <div className="text-base text-gray-700">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      {pedido.paciente_nome || 'Cliente'}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-base">
                      {new Date(pedido.data_criacao).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(pedido.data_criacao).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    <span className="text-lg font-bold text-green-700">
                      R$ {Number(pedido.total).toFixed(2)}
                    </span>
                  </div>
                </div>
                {pedido.devolucao_confirmada && (
                  <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                    <Package className="h-3 w-3" />
                    <span>Devolvido na farmácia</span>
                  </div>
                )}
                {pedido.devolucao_confirmada && pedido.motivo_problema && (
                  <div className="flex items-center gap-2 text-sm text-yellow-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>Motivo: {formatMotivoProblemaLabel(pedido.motivo_problema)}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2 p-0 pt-3 sm:flex-row sm:flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setDetalhePedido(pedido)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Button>
                {pedido.status === 'pendente' ? (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full sm:w-auto"
                      onClick={async () => {
                        await aceitarPedido(pedido);
                      }}
                    >
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={async () => {
                        await recusarPedido(pedido);
                      }}
                    >
                      Recusar
                    </Button>
                  </>
                ) : pedido.status === 'aceito' && pedido.status_entrega !== 'coletado' ? (
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      await solicitarMotoboy(pedido);
                    }}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    Solicitar Motoboy
                  </Button>
                ) : pedido.status === 'em_entrega' && pedido.status_entrega === 'indo_buscar' ? (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
                    onClick={async () => {
                      await confirmarProdutoEntregueAoMotoboy(pedido);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Produto entregue ao motoboy
                  </Button>
                ) : pedido.status === 'em_entrega' && pedido.devolucao_confirmada ? (
                  <div className="w-full rounded-md border border-dashed border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                    Devolução confirmada pela farmácia.
                  </div>
                ) : pedido.status === 'em_entrega' && pedido.status_entrega === 'retornando_farmacia' ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={pedidoDevolucaoLoading === pedido.id}
                    onClick={async () => {
                      await confirmarDevolucaoEntrega(pedido);
                    }}
                  >
                    {pedidoDevolucaoLoading === pedido.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Confirmar devolução
                      </>
                    )}
                  </Button>
                ) : pedido.status === 'em_entrega' ? (
                  pedidosColetados.includes(pedido.id) ||
                  pedido.status_entrega === 'coletado' ||
                  pedido.status_entrega === 'a_caminho' ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-green-300 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                      Aguardando entrega do motoboy
                    </div>
                  ) : (
                    <div className="w-full rounded-md border border-dashed border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                      Motoboy ainda não aceitou a corrida. Aguarde para confirmar a coleta.
                    </div>
                  )
                ) : null}
              </CardFooter>
            </Card>
          );
        })}
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

    </div>
  );
};

export default Orders;

