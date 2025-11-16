import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { finalize, forkJoin } from 'rxjs'; // forkJoin IMPORTANTE!
import { DashboardService, DashboardData, CategoriaPaiDTO, PalestranteEspecialidadeDTO, Filtros } from './dashboard.service';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
Chart.register(TreemapController, TreemapElement);

// --------- INTERFACE CARDS ----------
interface CategoriaRaizDashboard {
  id: number;
  nome: string;
  totalPalestrantes: number;
  destaque: 'mais' | 'menos' | null;
  subcategorias: Array<{
    id: number;
    nome: string;
    totalPalestrantes: number;
    destaque: 'mais' | 'menos' | null;
  }>;
}

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
  radarTop10: Array<{titulo: string, percentual: number}> = [];
  maiorMes: { mes: string, quantidade: number } | null = null;
  menorMes: { mes: string, quantidade: number } | null = null;
  categoriasRaizDashboard: CategoriaRaizDashboard[] = [];
  private pieChart: Chart | null = null;
  private lineChart: Chart | null = null;
  private donutFaixaChart: Chart | null = null;
  private radarChart: Chart | null = null;
  private treemapChart: Chart | null = null;
  private pieChartRendered = false;
  private lineChartRendered = false;
  private donutFaixaRendered = false;
  private radarRendered = false;
  private treemapRendered = false;
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
    window.scrollTo(0, 0);
    this.carregarCategorias();
    this.carregarDados();
    this.carregarCategoriasRaizesESubcategorias();
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
      if (!this.treemapRendered) {
        this.renderTreemapChart(); this.treemapRendered = true;
      }
    }
  }
  ngOnDestroy(): void {
    this.destroyPieChart();
    this.destroyLineChart();
    this.destroyDonutFaixaChart();
    this.destroyRadarChart();
    this.destroyTreemapChart();
  }
  carregarCategorias(): void {
    this.dashboardService.getCategorias().subscribe(
      (data: CategoriaPaiDTO[]) => {
        const nomes = data.map(c => c.categoria_nome);
        this.categorias = [...new Set(nomes)];
      }
    );
  }

  // AQUI COMEÇA O AJUSTE PARA O CARD DE CATEGORIA/SUBCOM PALESTRANTES
  carregarCategoriasRaizesESubcategorias(): void {
    forkJoin({
      categorias: this.dashboardService.getCategorias(),
      palestrantesEsp: this.dashboardService.getPalestrantesEspecialidades()
    }).subscribe(({categorias, palestrantesEsp}) => {
      const raizes = categorias.filter(c => c.pai_nome === null || c.pai_nome === 'Categoria Raiz');
      const subs   = categorias.filter(c => c.pai_nome !== null && c.pai_nome !== 'Categoria Raiz');

      const getPalestrantesSub = (subcatNome: string): number =>
        palestrantesEsp.filter(p => p.nomeEspecialidade === subcatNome).length;
      const getPalestrantesRaiz = (raizNome: string, subsArr: CategoriaPaiDTO[]): number => {
        const subNomes = subsArr.filter(s => s.pai_nome === raizNome).map(s => s.categoria_nome);
        return palestrantesEsp.filter(p => subNomes.includes(p.nomeEspecialidade)).length;
      };

      let lista: CategoriaRaizDashboard[] = raizes.map(raiz => {
        const suasSubs = subs.filter(s => s.pai_nome === raiz.categoria_nome);
        // Só mantém subcategorias com palestrante ≥ 1!
        const subcats = suasSubs
                        .map(sub => ({
                          id: -1,
                          nome: sub.categoria_nome,
                          totalPalestrantes: getPalestrantesSub(sub.categoria_nome),
                          destaque: null
                        }))
                        .filter(sub => sub.totalPalestrantes > 0);

        const total = getPalestrantesRaiz(raiz.categoria_nome, subs);
        return {
          id: -1,
          nome: raiz.categoria_nome,
          totalPalestrantes: total,
          destaque: null,
          subcategorias: subcats
        };
      })
      // Tira categoria pai 0 palestrantes e ord. decrescente
      .filter(cat => cat.totalPalestrantes > 0)
      .sort((a, b) => b.totalPalestrantes - a.totalPalestrantes);

      this.categoriasRaizDashboard = lista;
    });
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
        this.treemapRendered = false;
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
        this.treemapRendered = false;
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
    const ocupacaoSorted = [...this.dashboardData.ocupacaoEventos]
      .sort((a, b) => b.percentual - a.percentual)
      .slice(0, 10);
    this.radarLabels = ocupacaoSorted.map(e => e.titulo);
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
  private renderTreemapChart(): void {
    this.destroyTreemapChart();
    const ctx = document.getElementById('treemapCanvas') as HTMLCanvasElement | null;
    if (!ctx || !this.dashboardData || !this.dashboardData.atividadesPorTipo.length) return;
    const treemapData = this.dashboardData.atividadesPorTipo.map((ativ: any) => ({
      g: ativ.tipo,
      Tipo: ativ.quantidade
    }));
    const boxColors = [
      '#7c2886', '#439aff', '#fd9f3c', '#ffdc19', '#a73ac6',
      '#49b46c', '#fa63a5', '#567dcd', '#c4a000'
    ];
    this.treemapChart = new Chart(ctx, {
      type: 'treemap' as any,
      data: {
        datasets: [{
          type: 'treemap',
          tree: treemapData,
          key: 'Tipo',
          groups: ['g'],
          backgroundColor: (c: any) => boxColors[c.dataIndex % boxColors.length],
          borderWidth: 4,
          borderColor: '#fff',
          labels: {
            display: true,
            align: 'center',
            color: 'white',
            font: { size: 16 } as any,
            formatter: (ctx: any) => {
              return `${ctx.raw.g}`;
            }
          }
        } as any]
      },
      options: {
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
  private destroyTreemapChart(): void {
    if (this.treemapChart) {
      this.treemapChart.destroy();
      this.treemapChart = null;
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
    console.log('Iniciando exportação paginada ordenada...');

    // this.loading = true; 

    const reportElement = document.getElementById('dashboard-report-container');
    if (!reportElement) {
      console.error('Elemento do relatório "dashboard-report-container" não encontrado.');
      return;
    }

    // 2. Salvar estilos originais
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;

    // 3. Forçar estilos para captura total
    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';

    window.scrollTo(0, 0);

    // 4. Delay para repintura do CSS
    setTimeout(() => {
      
      const options = {
        scale: 2,
        useCORS: true,
        logging: false,
        width: reportElement.scrollWidth,
        height: reportElement.scrollHeight, // Garantia de altura total
        x: 0,
        y: 0,
        scrollY: -window.scrollY
      };

      html2canvas(reportElement, options).then(canvas => {
        // 5. Configuração do PDF (voltamos ao A4)
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdf = new jsPDF({
          orientation: 'p', // 'p' = portrait (retrato)
          unit: 'mm',       // unidade em milímetros
          format: 'a4'      // formato A4
        });

        const pdfWidth = pdf.internal.pageSize.getWidth(); // Largura da página A4 em mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // Altura da página A4 em mm

        // 6. Calcular a proporção
        // Escalamos a altura da IMAGEM para caber na LARGURA do PDF
        const ratio = imgHeight / imgWidth;
        const imgHeightOnPdf = pdfWidth * ratio; // Altura total da imagem *dentro* do PDF

        // 7. LÓGICA DE PAGINAÇÃO CORRIGIDA (GARANTE A ORDEM)
        
        let position = 0; // Posição Y (vertical) de onde a fatia começa

        // Adiciona a primeira página
        // (Adiciona a imagem inteira, mas o PDF "corta" o que passa da pdfHeight)
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightOnPdf);
        
        // Incrementa a posição pela altura de UMA página
        position = pdfHeight;

        // Loop: Enquanto a posição que já usamos for menor que a altura total da imagem
        while (position < imgHeightOnPdf) {
          pdf.addPage(); // Adiciona uma nova página em branco

          // Adiciona a imagem novamente, mas "puxada para cima"
          // O valor de 'position' negativo (ex: -297mm) age como um offset
          // "puxando" a imagem para cima, alinhando a próxima fatia ao topo
          // da nova página.
          pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, imgHeightOnPdf);
          
          // Move a posição para a próxima fatia
          position += pdfHeight;
        }
        
        // 8. Salvar o PDF
        pdf.save('Relatorio_Dashboard_Paginado.pdf');

      }).catch(err => {
        console.error('Erro ao gerar o PDF paginado:', err);
        alert('Ocorreu um erro ao tentar gerar o PDF paginado.');
      }).finally(() => {
        
        // 9. RESTAURAR os estilos originais
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.height = originalBodyHeight;
        document.documentElement.style.height = originalHtmlHeight;
        
        // this.loading = false;
      });
    }, 200);
  }
}
