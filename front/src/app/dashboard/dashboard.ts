import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface original (sem mudanças)
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

// Suposição das interfaces de retorno da API (Ajuste conforme necessário)
interface ApiEvento {
  id: number;
  titulo: string;
  dataInicio: string; // Esperado formato ISO (ex: "2024-10-20T09:00:00")
  dataFim: string; // Esperado formato ISO
  participantes: number; // Número de inscritos
  capacidade: number; // Capacidade máxima
  categoriaNome: string; // Nome da categoria
  idCategoria: number;
}

interface ApiAtividade {
  id: number;
  titulo: string;
  tipo: string; // Ex: "Palestra", "Workshop"
  idEvento: number;
  dataInicio: string; // Esperado formato ISO
  dataFim: string; // Esperado formato ISO
}

interface ApiPalestrante {
  id: number;
  nome: string;
}

interface ApiCategoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // Adicionado
  imports: [CommonModule, FormsModule, NgIf, NgFor, HttpClientModule], // Adicionado HttpClientModule
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
  categorias: Array<ApiCategoria> = []; // Usando a interface da API

  // Dados para gráficos (sem mudanças)
  chartDataEventosPorCategoria: any;
  chartDataParticipantesPorEvento: any;
  chartDataTendenciaEventos: any;
  chartDataDistribuicaoParticipantes: any;
  chartDataOcupacaoEventos: any;
  chartDataAtividadesPorTipo: any;

  // Base URL da API (Ajuste se necessário)
  private baseUrl = 'http://localhost:8080'; // Ex: 'http://localhost:8080' ou '/api' se estiver usando proxy

  // Cache dos dados brutos
  private rawEvents: ApiEvento[] = [];
  private rawActivities: ApiAtividade[] = [];
  private rawSpeakers: ApiPalestrante[] = [];

  constructor(private http: HttpClient) {} // Injetando HttpClient

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarDadosIniciais();
  }

  /**
   * Carrega a lista de categorias para o dropdown de filtro.
   */
  carregarCategorias(): void {
    this.http.get<ApiCategoria[]>(`${this.baseUrl}/categoria/hierarquia`)
      .pipe(catchError(err => {
        console.error('Erro ao carregar categorias', err);
        return of([]);
      }))
      .subscribe(data => {
        this.categorias = data;
      });
  }

  /**
   * Carrega os dados brutos da API uma única vez.
   */
  carregarDadosIniciais(): void {
    this.loading = true;
    this.error = null;

    const eventos$ = this.http.get<ApiEvento[]>(`${this.baseUrl}/consultas/view/detalhes-eventos`);
    const atividades$ = this.http.get<ApiAtividade[]>(`${this.baseUrl}/consultas/view/grade-atividades`);
    const palestrantes$ = this.http.get<ApiPalestrante[]>(`${this.baseUrl}/palestrante/buscar?nome=`);

    forkJoin({
      eventos: eventos$.pipe(catchError(err => of([]))),
      atividades: atividades$.pipe(catchError(err => of([]))),
      palestrantes: palestrantes$.pipe(catchError(err => of([])))
    }).subscribe({
      next: (data) => {
        this.rawEvents = data.eventos;
        this.rawActivities = data.atividades;
        this.rawSpeakers = data.palestrantes;
        
        // Processa os dados pela primeira vez (sem filtros)
        this.processarDadosFiltrados();
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro fatal ao carregar dados iniciais', err);
        this.error = 'Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.';
        this.loading = false;
      }
    });
  }

  /**
   * Aplica os filtros selecionados aos dados brutos e recalcula o dashboard.
   */
  processarDadosFiltrados(): void {
    if (this.rawEvents.length === 0) return; // Não processa se os dados brutos não carregaram

    this.loading = true;

    // 1. Filtrar Eventos
    let eventosFiltrados = [...this.rawEvents];

    if (this.filtroCategoria) {
      eventosFiltrados = eventosFiltrados.filter(e => e.idCategoria === +this.filtroCategoria);
    }
    if (this.filtroDataInicio) {
      const dataInicio = new Date(this.filtroDataInicio);
      eventosFiltrados = eventosFiltrados.filter(e => new Date(e.dataInicio) >= dataInicio);
    }
    if (this.filtroDataFim) {
      const dataFim = new Date(this.filtroDataFim);
      // Adiciona 1 dia para incluir o dia inteiro
      dataFim.setDate(dataFim.getDate() + 1); 
      eventosFiltrados = eventosFiltrados.filter(e => new Date(e.dataInicio) < dataFim);
    }

    // 2. Filtrar Atividades (com base nos eventos já filtrados)
    const idsEventosFiltrados = new Set(eventosFiltrados.map(e => e.id));
    const atividadesFiltradas = this.rawActivities.filter(a => idsEventosFiltrados.has(a.idEvento));

    // 3. Calcular os dados do dashboard
    // Usamos rawSpeakers pois os palestrantes não são filtráveis neste contexto
    this.dashboardData = this.calcularDashboard(eventosFiltrados, atividadesFiltradas, this.rawSpeakers);
    
    // 4. Preparar gráficos
    this.prepararGraficos();
    this.loading = false;
  }

  /**
   * Função principal que transforma dados brutos em dados de dashboard.
   */
  calcularDashboard(eventos: ApiEvento[], atividades: ApiAtividade[], palestrantes: ApiPalestrante[]): DashboardData {
    const totalEventos = eventos.length;
    const totalParticipantes = eventos.reduce((sum, e) => sum + (e.participantes || 0), 0);
    
    const duracoesHoras = eventos.map(e => this.getDuracaoHoras(e.dataInicio, e.dataFim));
    const totalHorasEventos = duracoesHoras.reduce((sum, h) => sum + h, 0);
    
    const contagemParticipantes = eventos.map(e => e.participantes || 0);
    const estatisticas = this.calcularEstatisticas(contagemParticipantes);

    // --- Categorias com Mais Eventos ---
    const categoriasCount = eventos.reduce((acc, e) => {
      const nome = e.categoriaNome || 'Sem Categoria';
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    const categoriasComMaisEventos = Object.entries(categoriasCount)
      .map(([nome, quantidade]) => ({ nome, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5); // Pega o top 5

    // --- Distribuição de Participantes ---
    const faixas = { '0-20': 0, '21-50': 0, '51-100': 0, '100+': 0 };
    eventos.forEach(e => {
      const p = e.participantes || 0;
      if (p <= 20) faixas['0-20']++;
      else if (p <= 50) faixas['21-50']++;
      else if (p <= 100) faixas['51-100']++;
      else faixas['100+']++;
    });
    const distribuicaoParticipantes = Object.entries(faixas).map(([faixa, quantidade]) => ({ faixa, quantidade }));

    // --- Tendência de Eventos por Mês ---
    const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const eventosPorMesCount = new Array(12).fill(0);
    eventos.forEach(e => {
      const mesIndex = new Date(e.dataInicio).getMonth(); // 0 = Jan, 11 = Dez
      eventosPorMesCount[mesIndex]++;
    });
    const tendenciaEventosPorMes = mesesNomes.map((mes, index) => ({
      mes,
      quantidade: eventosPorMesCount[index]
    })).filter(m => m.quantidade > 0); // Opcional: mostrar só meses com eventos

    // --- Ocupação de Eventos ---
    const ocupacaoEventos = eventos
      .filter(e => e.capacidade > 0) // Só calcula para eventos com capacidade definida
      .map(e => ({
        titulo: e.titulo,
        percentual: parseFloat(((e.participantes || 0) / e.capacidade * 100).toFixed(2))
      }))
      .sort((a, b) => b.percentual - a.percentual) // Ordena por maior ocupação
      .slice(0, 5); // Pega o top 5

    // --- Atividades por Tipo ---
    const atividadesCount = atividades.reduce((acc, a) => {
      const tipo = a.tipo || 'Outro';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    const atividadesPorTipo = Object.entries(atividadesCount).map(([tipo, quantidade]) => ({ tipo, quantidade }));

    return {
      totalEventos: totalEventos,
      totalParticipantes: totalParticipantes,
      totalPalestrantes: palestrantes.length, // Total de palestrantes (não filtrado)
      totalAtividades: atividades.length,
      mediaParticipantesPorEvento: totalEventos > 0 ? parseFloat((totalParticipantes / totalEventos).toFixed(2)) : 0,
      mediaHorasPorEvento: totalEventos > 0 ? parseFloat((totalHorasEventos / totalEventos).toFixed(2)) : 0,
      eventosMaisPopulares: [...eventos]
        .sort((a, b) => (b.participantes || 0) - (a.participantes || 0))
        .slice(0, 3)
        .map(e => ({ titulo: e.titulo, participantes: e.participantes || 0 })),
      categoriasComMaisEventos: categoriasComMaisEventos,
      distribuicaoParticipantes: distribuicaoParticipantes,
      tendenciaEventosPorMes: tendenciaEventosPorMes,
      ocupacaoEventos: ocupacaoEventos,
      atividadesPorTipo: atividadesPorTipo,
      estatisticasParticipantes: estatisticas,
      correlacaoHorasParticipantes: this.calcularCorrelacao(duracoesHoras, contagemParticipantes)
    };
  }

  // Função `prepararGraficos` permanece a mesma, pois ela lê de `this.dashboardData`
  prepararGraficos(): void {
    if (!this.dashboardData) return;

    // Gráfico 1: Eventos por Categoria (Gráfico de Barras)
    this.chartDataEventosPorCategoria = {
      labels: this.dashboardData.categoriasComMaisEventos.map(c => c.nome),
      datasets: [{
        label: 'Quantidade de Eventos',
        data: this.dashboardData.categoriasComMaisEventos.map(c => c.quantidade),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
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
    console.log('Filtros aplicados:', {
      categoria: this.filtroCategoria,
      dataInicio: this.filtroDataInicio,
      dataFim: this.filtroDataFim
    });
    // Apenas re-processa os dados que já estão em memória
    this.processarDadosFiltrados();
  }

  limparFiltros(): void {
    this.filtroCategoria = '';
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    // Re-processa para voltar ao estado original
    this.processarDadosFiltrados();
  }

  exportarRelatorio(): void {
    console.log('Exportando relatório...');
    // Implementar lógica de exportação (ex: usando uma lib como jsPDF ou Csv-export)
  }

  // --- FUNÇÕES AUXILIARES ---

  private getDuracaoHoras(inicio: string, fim: string): number {
    try {
      const dataInicio = new Date(inicio).getTime();
      const dataFim = new Date(fim).getTime();
      if (isNaN(dataInicio) || isNaN(dataFim) || dataFim <= dataInicio) {
        return 0;
      }
      const diffMs = dataFim - dataInicio;
      return diffMs / (1000 * 60 * 60); // ms para horas
    } catch (e) {
      return 0;
    }
  }

  private calcularEstatisticas(arr: number[]): { media: number, mediana: number, moda: number, variancia: number, desviopadrao: number } {
    if (arr.length === 0) {
      return { media: 0, mediana: 0, moda: 0, variancia: 0, desviopadrao: 0 };
    }

    // Média
    const media = arr.reduce((a, b) => a + b, 0) / arr.length;

    // Variância
    const variancia = arr.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / arr.length;

    // Desvio Padrão
    const desviopadrao = Math.sqrt(variancia);

    // Mediana
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const mediana = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Moda
    const modeMap = new Map<number, number>();
    let maxFreq = 0;
    let moda = 0;
    arr.forEach(val => {
      const freq = (modeMap.get(val) || 0) + 1;
      modeMap.set(val, freq);
      if (freq > maxFreq) {
        maxFreq = freq;
        moda = val;
      }
    });

    return {
      media: parseFloat(media.toFixed(2)),
      mediana: parseFloat(mediana.toFixed(2)),
      moda: moda,
      variancia: parseFloat(variancia.toFixed(2)),
      desviopadrao: parseFloat(desviopadrao.toFixed(2))
    };
  }

  private calcularCorrelacao(arr1: number[], arr2: number[]): number {
    if (arr1.length !== arr2.length || arr1.length === 0) {
      return 0;
    }
    
    const n = arr1.length;
    const media1 = arr1.reduce((a, b) => a + b, 0) / n;
    const media2 = arr2.reduce((a, b) => a + b, 0) / n;
    
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
      const x = arr1[i] - media1;
      const y = arr2[i] - media2;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    }

    const denominador = Math.sqrt(sumX2 * sumY2);
    if (denominador === 0) {
      return 0;
    }

    const correlacao = sumXY / denominador;
    return parseFloat(correlacao.toFixed(2));
  }
}