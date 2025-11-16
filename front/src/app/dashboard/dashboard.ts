import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common'; // NgIf/NgFor estão no CommonModule
import { HttpClientModule } from '@angular/common/http'; // 1. Importar HttpClientModule
import { finalize } from 'rxjs/operators';

// 2. Importar o serviço e as interfaces
import { DashboardService, DashboardData, CategoriaPaiDTO, Filtros } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // 3. Adicionar standalone: true
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule // 4. Adicionar HttpClientModule aos imports
    // NgIf e NgFor já estão inclusos no CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  providers: [DashboardService] // 5. Fornecer o serviço
})
export class Dashboard implements OnInit {
  dashboardData: DashboardData | null = null;
  loading: boolean = true;
  error: string | null = null;

  // Filtros
  filtroCategoria: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  categorias: string[] = []; // Alterado para lista de nomes (string)

  // Dados para gráficos
  chartDataEventosPorCategoria: any;
  chartDataParticipantesPorEvento: any;
  chartDataTendenciaEventos: any;
  chartDataDistribuicaoParticipantes: any;
  chartDataOcupacaoEventos: any;
  chartDataAtividadesPorTipo: any;

  // 6. Injetar o DashboardService
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarCategorias(); // Carrega os filtros
    this.carregarDados();     // Carrega os dados principais
  }

  carregarCategorias(): void {
    this.dashboardService.getCategorias().subscribe(
      (data: CategoriaPaiDTO[]) => {
        // Extrai nomes únicos de categorias
        const nomes = data.map(c => c.categoria_nome);
        this.categorias = [...new Set(nomes)]; // Remove duplicatas
      }
      // O erro já é tratado no serviço
    );
  }

  carregarDados(): void {
    this.loading = true;
    this.error = null;

    // 7. Remover dados simulados e chamar o serviço
    // this.dashboardData = this.gerarDadosSimulados(); // REMOVIDO

    const filtrosAtuais: Filtros = {
      categoria: this.filtroCategoria,
      dataInicio: this.filtroDataInicio,
      dataFim: this.filtroDataFim
    };

    this.dashboardService.getDashboardData(filtrosAtuais).pipe(
      finalize(() => {
        this.loading = false; // Garante que o loading termine
      })
    ).subscribe(
      (data: DashboardData) => {
        this.dashboardData = data;
        this.prepararGraficos(); // Prepara os gráficos com os dados reais
      },
      (err: Error) => {
        this.error = err.message || 'Erro desconhecido ao carregar dados.';
        this.dashboardData = null; // Limpa dados antigos em caso de erro
      }
    );
  }

  // 8. Remover a função gerarDadosSimulados()
  // gerarDadosSimulados(): DashboardData { ... } // REMOVIDO

  prepararGraficos(): void {
    if (!this.dashboardData) return;

    // Gráfico 1: Eventos por Categoria (Gráfico de Barras)
    this.chartDataEventosPorCategoria = {
      labels: this.dashboardData.categoriasComMaisEventos.map(c => c.nome),
      datasets: [{
        label: 'Quantidade de Eventos',
        data: this.dashboardData.categoriasComMaisEventos.map(c => c.quantidade),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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
    
    // ... O restante da função prepararGraficos() permanece igual ...
    // Gráfico 4: Distribuição de Participantes (Gráfico de Barras Horizontal)
    this.chartDataDistribuicaoParticipantes = {
      labels: this.dashboardData.distribuicaoParticipantes.map(d => d.faixa),
      datasets: [{
        label: 'Quantidade de Eventos',
        data: this.dashboardData.distribuicaoParticipantes.map(d => d.quantidade),
        backgroundColor: '#4BC0C0',
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
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  }

  aplicarFiltros(): void {
    // Esta função agora busca os dados filtrados da API (via serviço)
    console.log('Aplicando filtros e recarregando dados...');
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
    // Implementar lógica de exportação (provavelmente usando os dados de this.dashboardData)
  }
}