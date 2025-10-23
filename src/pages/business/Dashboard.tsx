/**
 * Página do Painel de Controle - Farmácia
 * 
 * Este arquivo contém:
 * 1. Visão geral das estatísticas da farmácia
 * 2. Gráficos de vendas, prescrições e entregas
 * 3. Avaliações dos clientes
 * 4. Métricas específicas do setor farmacêutico
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import CustomerReviews from '@/components/dashboard/CustomerReviews';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Package, 
  DollarSign, 
  FileText, 
  Truck, 
  Pill, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  Activity,
  Loader2,
  ShoppingCart
} from 'lucide-react';

interface DashboardData {
  vendas_hoje: {
    total: number;
    pedidos: number;
    percentual_crescimento: number;
  };
  pedidos_status: Array<{
    status: string;
    quantidade: number;
  }>;
  estoque: {
    baixo: number;
    total: number;
  };
  avaliacoes: {
    media: number;
    total: number;
  };
  vendas_por_categoria?: Array<{
    categoria: string;
    total_vendas: number;
  }>;
  pedidos_por_categoria?: Array<{
    categoria: string;
    total_pedidos: number;
  }>;
  produtos_por_categoria?: Array<{
    categoria: string;
    total_produtos: number;
  }>;
}

interface AtividadesRecentes {
  pedidos_recentes: Array<{
    id: number;
    numero_pedido: string;
    total: number;
    status: string;
    criado_em: string;
    paciente_nome: string;
  }>;
  avaliacoes_recentes: Array<{
    id: number;
    nota: number;
    comentario: string;
    criado_em: string;
    paciente_nome: string;
  }>;
}

/**
 * Componente da página do painel de controle para farmácias
 * 
 * @returns JSX.Element - Página do painel com estatísticas específicas de farmácia
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadesRecentes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar estatísticas do dashboard
        const metricas = await apiService.dashboard.getMetricas();
        
        // Carregar estatísticas por categoria
        const estatisticasPorCategoria = await apiService.dashboard.getEstatisticasPorCategoria(30);
        
        // Combinar os dados
        setDashboardData({
          ...metricas,
          vendas_por_categoria: estatisticasPorCategoria.vendas_por_categoria,
          pedidos_por_categoria: estatisticasPorCategoria.pedidos_por_categoria,
          produtos_por_categoria: estatisticasPorCategoria.produtos_por_categoria
        });
        
        // Carregar atividades recentes
        const atividades = await apiService.dashboard.getAtividadesRecentes();
        setAtividadesRecentes(atividades);
        
      } catch (error: any) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter status em português
  const getStatusTraduzido = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pendente': 'Pendente',
      'em_preparo': 'Em Preparo',
      'pronto_entrega': 'Pronto para Entrega',
      'em_entrega': 'Em Entrega',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pendente': 'bg-orange-100 text-orange-800',
      'em_preparo': 'bg-blue-100 text-blue-800',
      'pronto_entrega': 'bg-yellow-100 text-yellow-800',
      'em_entrega': 'bg-purple-100 text-purple-800',
      'entregue': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel da Farmácia</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo, {user?.nome}! Aqui está o resumo do seu negócio.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="flex items-center space-x-1 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Online</span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Vendas do Dia */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Dia</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? formatarMoeda(dashboardData.vendas_hoje.total) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {dashboardData && dashboardData.vendas_hoje.percentual_crescimento > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              {dashboardData ? (
                `${dashboardData.vendas_hoje.percentual_crescimento > 0 ? '+' : ''}${dashboardData.vendas_hoje.percentual_crescimento.toFixed(1)}% em relação ao dia anterior`
              ) : (
                '0% em relação ao dia anterior'
              )}
            </p>
          </CardContent>
        </Card>

        {/* Pedidos do Dia */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? dashboardData.vendas_hoje.pedidos : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados hoje
            </p>
          </CardContent>
        </Card>

        {/* Avaliações */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? (Number(dashboardData.avaliacoes.media) || 5.0).toFixed(1) : '5.0'}★
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData ? dashboardData.avaliacoes.total : 0} avaliações recebidas
            </p>
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData ? dashboardData.estoque.total : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData ? dashboardData.estoque.baixo : 0} com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de métricas secundárias */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Estoque Crítico */}
        <Card className={`border-orange-200 ${dashboardData && dashboardData.estoque.baixo > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${dashboardData && dashboardData.estoque.baixo > 0 ? 'text-orange-800' : 'text-gray-800'}`}>
              Estoque Crítico
            </CardTitle>
            <AlertTriangle className={`h-4 w-4 ${dashboardData && dashboardData.estoque.baixo > 0 ? 'text-orange-600' : 'text-gray-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${dashboardData && dashboardData.estoque.baixo > 0 ? 'text-orange-800' : 'text-gray-800'}`}>
              {dashboardData ? dashboardData.estoque.baixo : 0}
            </div>
            <p className={`text-xs ${dashboardData && dashboardData.estoque.baixo > 0 ? 'text-orange-700' : 'text-gray-700'}`}>
              Produtos com estoque baixo
            </p>
          </CardContent>
        </Card>

        {/* Status dos Pedidos */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Status dos Pedidos</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardData?.pedidos_status.map((status) => (
                <div key={status.status} className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">{getStatusTraduzido(status.status)}</span>
                  <span className="text-sm font-medium text-blue-800">{status.quantidade}</span>
                </div>
              ))}
              {(!dashboardData || dashboardData.pedidos_status.length === 0) && (
                <span className="text-sm text-blue-700">Nenhum pedido hoje</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total de Avaliações */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total de Avaliações</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {dashboardData ? dashboardData.avaliacoes.total : 0}
            </div>
            <p className="text-xs text-green-700">
              Avaliações recebidas no total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Atividades Recentes */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pedidos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividadesRecentes?.pedidos_recentes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{pedido.numero_pedido} - {pedido.paciente_nome}</p>
                    <p className="text-xs text-muted-foreground">{formatarMoeda(pedido.total)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pedido.status)}`}>
                      {getStatusTraduzido(pedido.status)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatarData(pedido.criado_em)}
                    </p>
                  </div>
                </div>
              ))}
              {(!atividadesRecentes || atividadesRecentes.pedidos_recentes.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum pedido recente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Avaliações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Avaliações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividadesRecentes?.avaliacoes_recentes.map((avaliacao) => (
                <div key={avaliacao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{avaliacao.paciente_nome}</p>
                    <p className="text-xs text-muted-foreground">{avaliacao.comentario}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-yellow-600">
                      {avaliacao.nota}★
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatarData(avaliacao.criado_em)}
                    </p>
                  </div>
                </div>
              ))}
              {(!atividadesRecentes || atividadesRecentes.avaliacoes_recentes.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma avaliação recente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Estatísticas por Categoria */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Estatísticas por Categoria</h2>
          <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Vendas por Categoria */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Vendas por Categoria</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData?.vendas_por_categoria?.slice(0, 5).map((categoria, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-green-700 truncate">{categoria.categoria}</span>
                    <span className="text-sm font-medium text-green-800">
                      {formatarMoeda(categoria.total_vendas)}
                    </span>
                  </div>
                ))}
                {(!dashboardData?.vendas_por_categoria || dashboardData.vendas_por_categoria.length === 0) && (
                  <span className="text-sm text-green-700">Nenhuma venda registrada</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pedidos por Categoria */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Pedidos por Categoria</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData?.pedidos_por_categoria?.slice(0, 5).map((categoria, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 truncate">{categoria.categoria}</span>
                    <span className="text-sm font-medium text-blue-800">
                      {categoria.total_pedidos}
                    </span>
                  </div>
                ))}
                {(!dashboardData?.pedidos_por_categoria || dashboardData.pedidos_por_categoria.length === 0) && (
                  <span className="text-sm text-blue-700">Nenhum pedido registrado</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Produtos por Categoria */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Produtos por Categoria</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData?.produtos_por_categoria?.slice(0, 5).map((categoria, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-purple-700 truncate">{categoria.categoria}</span>
                    <span className="text-sm font-medium text-purple-800">
                      {categoria.total_produtos}
                    </span>
                  </div>
                ))}
                {(!dashboardData?.produtos_por_categoria || dashboardData.produtos_por_categoria.length === 0) && (
                  <span className="text-sm text-purple-700">Nenhum produto cadastrado</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráficos */}
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
