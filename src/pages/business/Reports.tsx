import { useState } from 'react'
import { useTheme } from '@/contexts'
import { Line, Bar, Pie } from 'react-chartjs-2'
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
  Legend
} from 'chart.js'

// Registra os componentes do ChartJS
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
)

export default function Reports() {
  const { theme } = useTheme()
  const [period, setPeriod] = useState('week')

  // Dados de exemplo para os gráficos
  const salesData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const ordersData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Pedidos',
        data: [12, 19, 30, 50, 20, 30, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      }
    ]
  }

  const productsData = {
    labels: ['Medicamentos', 'Cosméticos', 'Suplementos', 'Outros'],
    datasets: [
      {
        data: [300, 50, 100, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ]
      }
    ]
  }

  return (
    <div className={`reports-page ${theme}`}>
      <div className="page-header">
        <h1>Relatórios</h1>
        <div className="period-selector">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
          </select>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Vendas</h2>
          <Line data={salesData} />
        </div>

        <div className="chart-card">
          <h2>Pedidos</h2>
          <Bar data={ordersData} />
        </div>

        <div className="chart-card">
          <h2>Produtos por Categoria</h2>
          <Pie data={productsData} />
        </div>
      </div>
    </div>
  )
} 