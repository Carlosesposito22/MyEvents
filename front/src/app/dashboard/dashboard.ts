import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { DashboardService, DashboardData, CategoriaPaiDTO, Filtros } from './dashboard.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  providers: [DashboardService]
})
export class Dashboard implements OnInit, AfterViewChecked, OnDestroy {
  dashboardData: DashboardData | null = null;
  loading: boolean = true;
  error: string | null = null;
  filtroCategoria: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  categorias: string[] = [];

  // Para tabela left do radar
  radarTop10: Array<{titulo: string, percentual: number}> = [];

  // Destaques dos meses do gráfico de linha
  maiorMes: { mes: string, quantidade: number } | null = null;
  menorMes: { mes: string, quantidade: number } | null = null;

  // Chart.js references & controls
  private pieChart: Chart | null = null;
  private lineChart: Chart | null = null;
  private donutFaixaChart: Chart | null = null;
  private radarChart: Chart | null = null;

  private pieChartRendered = false;
  private lineChartRendered = false;
  private donutFaixaRendered = false;
  private radarRendered = false;

  donutFaixaLabels: string[] = [];
  donutFaixaData: number[] = [];
  donutFaixaColors: string[] = [
    '#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#AAAAAA','#B2FF66','#66FFB2','#FF66AA'
  ];

  radarLabels: string[] = [];
  radarData: number[] = [];
  radarColors: string[] = [
    '#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#AAAAAA','#B2FF66','#66FFB2','#FF66AA'
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarDados();
  }

  ngAfterViewChecked(): void {
    if (this.dashboardData && !this.loading && !this.error) {
      if (!this.pieChartRendered) {
        this.renderPieChart(); this.pieChartRendered = true;
      }
      if (!this.lineChartRendered) {
        this.renderLineChart(); this.lineChartRendered = true;
      }
      if (!this.donutFaixaRendered) {
        this.renderDonutFaixaChart(); this.donutFaixaRendered = true;
      }
      if (!this.radarRendered) {
        this.renderRadarChart(); this.radarRendered = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyPieChart();
    this.destroyLineChart();
    this.destroyDonutFaixaChart();
    this.destroyRadarChart();
  }

  carregarCategorias(): void {
    this.dashboardService.getCategorias().subscribe(
      (data: CategoriaPaiDTO[]) => {
        const nomes = data.map(c => c.categoria_nome);
        this.categorias = [...new Set(nomes)];
      }
    );
  }

  carregarDados(): void {
    this.loading = true;
    this.error = null;
    const filtrosAtuais: Filtros = {
      categoria: this.filtroCategoria,
      dataInicio: this.filtroDataInicio,
      dataFim: this.filtroDataFim
    };
    this.dashboardService.getDashboardData(filtrosAtuais).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(
      (data: DashboardData) => {
        this.dashboardData = data;
        this.pieChartRendered = false;
        this.lineChartRendered = false;
        this.donutFaixaRendered = false;
        this.radarRendered = false;
        if (data.tendenciaEventosPorMes && data.tendenciaEventosPorMes.length) {
          this.maiorMes = data.tendenciaEventosPorMes.reduce(
            (max, curr) => (curr.quantidade > max.quantidade ? curr : max),
            data.tendenciaEventosPorMes[0]
          );
          this.menorMes = data.tendenciaEventosPorMes.reduce(
            (min, curr) => (curr.quantidade < min.quantidade ? curr : min),
            data.tendenciaEventosPorMes[0]
          );
        } else {
          this.maiorMes = null;
          this.menorMes = null;
        }
      },
      (err: Error) => {
        this.error = err.message || 'Erro desconhecido ao carregar dados.';
        this.dashboardData = null;
        this.pieChartRendered = false;
        this.lineChartRendered = false;
        this.donutFaixaRendered = false;
        this.radarRendered = false;
        this.maiorMes = null;
        this.menorMes = null;
      }
    );
  }

  private renderPieChart(): void {
    this.destroyPieChart();
    const ctx = document.getElementById('pieCanvas') as HTMLCanvasElement | null;
    if (!ctx || !this.dashboardData || !this.dashboardData.eventosMaisPopulares.length) return;
    const eventos = this.dashboardData.eventosMaisPopulares || [];
    const topN = 12;
    const topEventos = eventos.slice(0, topN);
    const restoEventos = eventos.slice(topN);
    let labels = topEventos.map(e => e.titulo);
    let data = topEventos.map(e => e.participantes);
    if (restoEventos.length > 0) {
      labels.push('Outros');
      data.push(restoEventos.reduce((sum, e) => sum + e.participantes, 0));
    }
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#AAAAAA', '#B2FF66', '#66FFB2', '#FF66AA',
      '#40C0FF', '#7798EE', '#888888'
    ];
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: {
              boxWidth: 20,
              padding: 16,
              font: {
                size: 14
              }
            }
          }
        },
        layout: {
          padding: 16
        }
      }
    });
  }
  private destroyPieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = null;
    }
  }

  private renderLineChart(): void {
    this.destroyLineChart();
    const ctx = document.getElementById('lineCanvas') as HTMLCanvasElement | null;
    if (!ctx || !this.dashboardData || !this.dashboardData.tendenciaEventosPorMes.length) return;
    const labels = this.dashboardData.tendenciaEventosPorMes.map(m => m.mes);
    const data = this.dashboardData.tendenciaEventosPorMes.map(m => m.quantidade);
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Eventos por mês',
          data: data,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54,162,235,0.14)',
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#2563eb',
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBorderColor: '#fff',
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Qtd eventos'}
          },
          x: {
            title: { display: true, text: 'Mês' }
          }
        }
      }
    });
  }
  private destroyLineChart(): void {
    if (this.lineChart) {
      this.lineChart.destroy();
      this.lineChart = null;
    }
  }

  private renderDonutFaixaChart(): void {
    this.destroyDonutFaixaChart();
    const ctx = document.getElementById('donutFaixaCanvas') as HTMLCanvasElement | null;
    if (!ctx || !this.dashboardData || !this.dashboardData.distribuicaoParticipantes.length) return;
    this.donutFaixaLabels = this.dashboardData.distribuicaoParticipantes.map(f => f.faixa);
    this.donutFaixaData = this.dashboardData.distribuicaoParticipantes.map(f => f.quantidade);
    this.donutFaixaChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.donutFaixaLabels,
        datasets: [{
          data: this.donutFaixaData,
          backgroundColor: this.donutFaixaColors.slice(0, this.donutFaixaLabels.length),
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        cutout: '60%',
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        layout: { padding: 16 }
      }
    });
  }
  private destroyDonutFaixaChart(): void {
    if (this.donutFaixaChart) {
      this.donutFaixaChart.destroy();
      this.donutFaixaChart = null;
    }
  }

  private renderRadarChart(): void {
    this.destroyRadarChart();
    const ctx = document.getElementById('radarCanvas') as HTMLCanvasElement | null;
    if (!ctx || !this.dashboardData || !this.dashboardData.ocupacaoEventos.length) return;

    // TOP 10 ORDENADO
    const ocupacaoSorted = [...this.dashboardData.ocupacaoEventos]
      .sort((a, b) => b.percentual - a.percentual)
      .slice(0, 10);

    this.radarLabels = ocupacaoSorted.map(e => e.titulo); // não truncar aqui!
    this.radarData   = ocupacaoSorted.map(e => e.percentual);
    this.radarTop10  = ocupacaoSorted;

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.radarLabels,
        datasets: [{
          label: 'Ocupação (%)',
          data: this.radarData,
          fill: true,
          backgroundColor: 'rgba(255, 207, 87, 0.15)',
          borderColor: '#f59e0b',
          pointBackgroundColor: this.radarColors.slice(0, this.radarLabels.length),
          pointBorderColor: '#fff',
          pointRadius: 7,
          borderWidth: 3,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        elements: {
          line: { borderJoinStyle: 'bevel' }
        },
        scales: {
          r: {
            angleLines: { color: '#e5e7eb' },
            grid: { color: '#e5e7eb' },
            pointLabels: {
              font: { size: 14, weight: 600 },
              color: '#484848',
              padding: 2,
              callback: function(label: string) {
                return label.length > 22 ? label.substring(0, 20) + "..." : label;
              }
            },
            min: 0,
            max: 100,
            ticks: {
              display: true,
              stepSize: 10,
              callback: function(val) { return val + "%" }
            }
          }
        }
      }
    });
  }
  private destroyRadarChart(): void {
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }
  }

  aplicarFiltros(): void {
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
    // Implemente conforme necessidade
  }
}
