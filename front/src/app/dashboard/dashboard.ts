import { Component, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';

interface DashboardData {
  totalEventos: number;
  totalParticipantes: number;
  totalPalestrantes: number;
  totalAtividades: number;
  mediaParticipantesPorEvento: number;
  mediaHorasPorEvento: number;
  eventosMaisPopulares: Array<{ titulo: string; participantes: number }>;
  categoriasComMaisEventos: Array<{ nome: string; quantidade: number }>;
  distribuicaoParticipantes: Array<{ faixa: string; quantidade: number }>;
  tendenciaEventosPorMes: Array<{ mes: string; quantidade: number }>;
  ocupacaoEventos: Array<{ titulo: string; percentual: number }>;
  atividadesPorTipo: Array<{ tipo: string; quantidade: number }>;
  estatisticasParticipantes: {
    media: number;
    mediana: number;
    moda: number;
    variancia: number;
    desviopadrao: number;
  };
  correlacaoHorasParticipantes: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  dashboardData: DashboardData | null = null;
  loading: boolean = true;
  error: string | null = null;

  // Filtros
  filtroCategoria: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  categorias: Array<{ id: number; nome: string }> = [];

  // Dados para gráficos
  chartDataEventosPorCategoria: any;
  chartDataParticipantesPorEvento: any;
  chartDataTendenciaEventos: any;
  chartDataDistribuicaoParticipantes: any;
  chartDataOcupacaoEventos: any;
  chartDataAtividadesPorTipo: any;

  constructor() {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.error = null;

    // Simulando dados do backend
    this.dashboardData = this.gerarDadosSimulados();
    this.prepararGraficos();
    this.loading = false;
  }

  gerarDadosSimulados(): DashboardData {
    // Dados simulados para demonstração
    const dados: DashboardData = {
      totalEventos: 15,
      totalParticipantes: 450,
      totalPalestrantes: 25,
      totalAtividades: 42,
      mediaParticipantesPorEvento: 30,
      mediaHorasPorEvento: 8,
      eventosMaisPopulares: [
        { titulo: 'Conferência de Tecnologia 2024', participantes: 120 },
        { titulo: 'Workshop de Angular Avançado', participantes: 85 },
        { titulo: 'Seminário de DevOps', participantes: 75 }
      ],
      categoriasComMaisEventos: [
        { nome: 'Tecnologia', quantidade: 8 },
        { nome: 'Negócios', quantidade: 4 },
        { nome: 'Educação', quantidade: 3 }
      ],
      distribuicaoParticipantes: [
        { faixa: '0-20', quantidade: 3 },
        { faixa: '21-50', quantidade: 7 },
        { faixa: '51-100', quantidade: 4 },
        { faixa: '100+', quantidade: 1 }
      ],
      tendenciaEventosPorMes: [
        { mes: 'Janeiro', quantidade: 2 },
        { mes: 'Fevereiro', quantidade: 3 },
        { mes: 'Março', quantidade: 2 },
        { mes: 'Abril', quantidade: 4 },
        { mes: 'Maio', quantidade: 2 },
        { mes: 'Junho', quantidade: 2 }
      ],
      ocupacaoEventos: [
        { titulo: 'Evento A', percentual: 95 },
        { titulo: 'Evento B', percentual: 75 },
        { titulo: 'Evento C', percentual: 60 },
        { titulo: 'Evento D', percentual: 85 }
      ],
      atividadesPorTipo: [
        { tipo: 'Palestra', quantidade: 20 },
        { tipo: 'Workshop', quantidade: 15 },
        { tipo: 'Mesa Redonda', quantidade: 7 }
      ],
      estatisticasParticipantes: {
        media: 30,
        mediana: 28,
        moda: 25,
        variancia: 156.25,
        desviopadrao: 12.5
      },
      correlacaoHorasParticipantes: 0.78
    };

    return dados;
  }

  prepararGraficos(): void {
    if (!this.dashboardData) return;

    // Gráfico 1: Eventos por Categoria (Gráfico de Barras)
    this.chartDataEventosPorCategoria = {
      labels: this.dashboardData.categoriasComMaisEventos.map(c => c.nome),
      datasets: [{
        label: 'Quantidade de Eventos',
        data: this.dashboardData.categoriasComMaisEventos.map(c => c.quantidade),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1
      }]
    };

    // Gráfico 2: Participantes por Evento (Gráfico de Pizza)
    this.chartDataParticipantesPorEvento = {
      labels: this.dashboardData.eventosMaisPopulares.map(e => e.titulo),
      datasets: [{
        data: this.dashboardData.eventosMaisPopulares.map(e => e.participantes),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };

    // Gráfico 3: Tendência de Eventos por Mês (Gráfico de Linha)
    this.chartDataTendenciaEventos = {
      labels: this.dashboardData.tendenciaEventosPorMes.map(t => t.mes),
      datasets: [{
        label: 'Quantidade de Eventos',
        data: this.dashboardData.tendenciaEventosPorMes.map(t => t.quantidade),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };

    // Gráfico 4: Distribuição de Participantes (Gráfico de Barras Horizontal)
    this.chartDataDistribuicaoParticipantes = {
      labels: this.dashboardData.distribuicaoParticipantes.map(d => d.faixa),
      datasets: [{
        label: 'Quantidade de Eventos',
        data: this.dashboardData.distribuicaoParticipantes.map(d => d.quantidade),
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        borderWidth: 1
      }]
    };

    // Gráfico 5: Ocupação dos Eventos (Gráfico de Radar)
    this.chartDataOcupacaoEventos = {
      labels: this.dashboardData.ocupacaoEventos.map(o => o.titulo),
      datasets: [{
        label: 'Percentual de Ocupação (%)',
        data: this.dashboardData.ocupacaoEventos.map(o => o.percentual),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2
      }]
    };

    // Gráfico 6: Atividades por Tipo (Gráfico de Rosca)
    this.chartDataAtividadesPorTipo = {
      labels: this.dashboardData.atividadesPorTipo.map(a => a.tipo),
      datasets: [{
        data: this.dashboardData.atividadesPorTipo.map(a => a.quantidade),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  }

  aplicarFiltros(): void {
    // Implementar lógica de filtros
    console.log('Filtros aplicados:', {
      categoria: this.filtroCategoria,
      dataInicio: this.filtroDataInicio,
      dataFim: this.filtroDataFim
    });
    this.carregarDados();
  }

  limparFiltros(): void {
    this.filtroCategoria = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.carregarDados();
  }

  exportarRelatorio(): void {
    console.log('Exportando relatório...');
    // Implementar lógica de exportação
  }
}
