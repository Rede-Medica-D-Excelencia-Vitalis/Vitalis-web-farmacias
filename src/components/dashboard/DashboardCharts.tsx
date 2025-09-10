/**
 * Componente de Gráficos do Dashboard
 * 
 * Este arquivo contém:
 * 1. Configuração do ChartJS
 * 2. Gráfico de linha para vendas
 * 3. Gráfico de barras para pedidos
 * 4. Gráfico de pizza para produtos por categoria
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Registra os componentes necessários do ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface EstatisticasPorCategoria {
  vendas_por_categoria: Array<{
    categoria: string;
    total_vendas: number;
    total_pedidos: number;
    quantidade_vendida: number;
  }>;
  pedidos_por_categoria: Array<{
    categoria: string;
    total_pedidos: number;
    pedidos_entregues: number;
    pedidos_cancelados: number;
  }>;
  produtos_por_categoria: Array<{
    categoria: string;
    total_produtos: number;
    estoque_total: number;
    produtos_estoque_baixo: number;
    produtos_sem_estoque: number;
  }>;
  vendas_por_dia: Array<{
    data: string;
    total_vendas: number;
    total_pedidos: number;
  }>;
}

/**
 * Componente principal que renderiza os gráficos do dashboard
 * 
 * @returns JSX.Element - Grid com três gráficos diferentes
 */
const DashboardCharts = () => {
  const [dados, setDados] = useState<EstatisticasPorCategoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const estatisticas = await apiService.dashboard.getEstatisticasPorCategoria(30);
        setDados(estatisticas);
      } catch (error: any) {
        console.error('Erro ao carregar estatísticas por categoria:', error);
        toast.error('Erro ao carregar dados dos gráficos');
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
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  // Dados para o gráfico de vendas por dia
  const vendasPorDiaData = {
    labels: dados?.vendas_por_dia.map(item => formatarData(item.data)).reverse() || [],
    datasets: [
      {
        label: 'Vendas (R$)',
        data: dados?.vendas_por_dia.map(item => item.total_vendas).reverse() || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Dados para o gráfico de pedidos por categoria
  const pedidosPorCategoriaData = {
    labels: dados?.pedidos_por_categoria.map(item => item.categoria) || [],
    datasets: [
      {
        label: 'Total de Pedidos',
        data: dados?.pedidos_por_categoria.map(item => item.total_pedidos) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Pedidos Entregues',
        data: dados?.pedidos_por_categoria.map(item => item.pedidos_entregues) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de produtos por categoria
  const produtosPorCategoriaData = {
    labels: dados?.produtos_por_categoria.map(item => item.categoria) || [],
    datasets: [
      {
        data: dados?.produtos_por_categoria.map(item => item.total_produtos) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(6, 182, 212, 0.6)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)',
          'rgb(6, 182, 212)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Opções comuns para os gráficos
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Opções específicas para gráfico de linha
  const lineOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatarMoeda(value);
          }
        }
      }
    },
    plugins: {
      ...options.plugins,
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Vendas: ${formatarMoeda(context.parsed.y)}`;
          }
        }
      }
    }
  };

  // Opções específicas para gráfico de barras
  const barOptions = {
    ...options,
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Carregando dados...</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Gráfico de vendas por dia */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          {dados && dados.vendas_por_dia.length > 0 ? (
            <Line options={lineOptions} data={vendasPorDiaData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Nenhum dado de vendas disponível
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de pedidos por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {dados && dados.pedidos_por_categoria.length > 0 ? (
            <Bar options={barOptions} data={pedidosPorCategoriaData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Nenhum dado de pedidos disponível
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de produtos por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {dados && dados.produtos_por_categoria.length > 0 ? (
            <Pie options={options} data={produtosPorCategoriaData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Nenhum dado de produtos disponível
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { DashboardCharts };
export default DashboardCharts;
