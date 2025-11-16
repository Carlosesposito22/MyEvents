import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ### INTERFACES DA API (Baseado no Swagger) ###
// Idealmente, ficariam em um arquivo 'models.ts'

// Interface principal que o componente espera
export interface DashboardData {
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

// DTOs da API que vamos usar
export interface ViewDetalhesEventoDTO {
  id_evento: number;
  titulo: string;
  data_inicio: string; // "2025-11-16"
  data_fim: string;
  numero_participantes: number;
  limite_participantes: number;
  carga_horaria: number;
  qtd_atividades: number;
  qtd_palestrantes: number;
  nomeCategoria: string;
  // ...outros campos
}

export interface ViewGradeAtividadeDTO {
  id_evento: number;
  tipoAtividade: string;
  atividade: string;
  // ...outros campos
}

export interface PalestranteEspecialidadeDTO {
  nomeEspecialidade: string;
  nomePalestrante: string;
}

export interface CategoriaPaiDTO {
  categoria_nome: string;
  pai_nome: string | null;
}

export interface Filtros {
  categoria: string; // No seu filtro é string, mas a API pode esperar ID. Vamos filtrar por nome.
  dataInicio: string;
  dataFim: string;
}


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Base URL da sua API
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  /**
   * Busca as categorias para popular o dropdown de filtro.
   */
  getCategorias(): Observable<CategoriaPaiDTO[]> {
    return this.http.get<CategoriaPaiDTO[]>(`${this.apiUrl}/categoria/hierarquia`).pipe(
      catchError(err => {
        console.error('Erro ao buscar categorias:', err);
        return of([]); // Retorna array vazio em caso de erro
      })
    );
  }

  /**
   * Busca todos os dados brutos necessários para o dashboard.
   */
  private getRawData(): Observable<{ eventos: ViewDetalhesEventoDTO[], atividades: ViewGradeAtividadeDTO[], palestrantes: PalestranteEspecialidadeDTO[] }> {

    const eventos$ = this.http.get<ViewDetalhesEventoDTO[]>(`${this.apiUrl}/consultas/view/detalhes-eventos`);
    const atividades$ = this.http.get<ViewGradeAtividadeDTO[]>(`${this.apiUrl}/consultas/view/grade-atividades`);
    const palestrantes$ = this.http.get<PalestranteEspecialidadeDTO[]>(`${this.apiUrl}/consultas/palestrantes-especialidades`);

    // forkJoin espera todas as chamadas terminarem
    return forkJoin({
      eventos: eventos$,
      atividades: atividades$,
      palestrantes: palestrantes$
    });
  }

  /**
   * Busca e processa os dados para montar o objeto DashboardData.
   */
  getDashboardData(filtros: Filtros): Observable<DashboardData> {
    return this.getRawData().pipe(
      map(rawData => {
        // 1. Aplicar Filtros (Client-side)
        // Se a API permitisse filtros nos endpoints de consulta, seria mais eficiente.
        // Como não parece ser o caso, filtramos aqui.
        const eventosFiltrados = this.aplicarFiltrosEventos(rawData.eventos, filtros);

        // 2. Processar os dados filtrados
        return this.processarDados(eventosFiltrados, rawData.atividades, rawData.palestrantes);
      }),
      catchError(err => {
        console.error('Erro ao processar dados do dashboard:', err);
        throw new Error('Não foi possível carregar os dados do dashboard.');
      })
    );
  }

  private aplicarFiltrosEventos(eventos: ViewDetalhesEventoDTO[], filtros: Filtros): ViewDetalhesEventoDTO[] {
      let eventosFiltrados = [...eventos];

      // Filtro de Categoria (por nome)
      if (filtros.categoria) {
          eventosFiltrados = eventosFiltrados.filter(e => e.nomeCategoria === filtros.categoria);
      }

      // Filtro de Data de Início
      if (filtros.dataInicio) {
          const dataInicioFiltro = new Date(filtros.dataInicio + 'T00:00:00'); // Adiciona hora para evitar problemas de fuso
          eventosFiltrados = eventosFiltrados.filter(e => new Date(e.data_inicio) >= dataInicioFiltro);
      }

      // Filtro de Data de Fim
      if (filtros.dataFim) {
          const dataFimFiltro = new Date(filtros.dataFim + 'T23:59:59'); // Adiciona hora para evitar problemas de fuso
          eventosFiltrados = eventosFiltrados.filter(e => new Date(e.data_inicio) <= dataFimFiltro); // Usando data_inicio para ver se "cai" no período
      }

      return eventosFiltrados;
  }

  /**
   * Transforma os dados brutos da API no formato que o componente espera.
   */
  private processarDados(eventos: ViewDetalhesEventoDTO[], todasAtividades: ViewGradeAtividadeDTO[], palestrantes: PalestranteEspecialidadeDTO[]): DashboardData {

    if (eventos.length === 0) {
        // Retorna dados zerados se nenhum evento passar pelo filtro
        return this.getDadosZerados();
    }

    const participantesPorEvento = eventos.map(e => e.numero_participantes);
    const horasPorEvento = eventos.map(e => e.carga_horaria);

    // Filtra as atividades para incluir apenas aquelas dos eventos filtrados
    const idsEventosFiltrados = new Set(eventos.map(e => e.id_evento));
    const atividadesFiltradas = todasAtividades.filter(a => idsEventosFiltrados.has(a.id_evento));

    // --- Cálculos ---
    const totalEventos = eventos.length;
    const totalParticipantes = this.stats.sum(participantesPorEvento);
    const totalPalestrantes = palestrantes.length; // Total geral, não filtrado
    const totalAtividades = atividadesFiltradas.length;

    // --- Gráficos ---
    const eventosMaisPopulares = [...eventos]
      // ...
      .map(e => ({ titulo: e.titulo, participantes: e.numero_participantes }));

    const categoriasComMaisEventos = this.helpers.groupBy(eventos, 'nomeCategoria');

    // CORREÇÃO: Mapeia o resultado do groupBy (que tem 'nome') para o formato esperado (com 'tipo')
    const groupedAtividades = this.helpers.groupBy(atividadesFiltradas, 'tipoAtividade');
    const atividadesPorTipo = groupedAtividades.map(item => ({
      tipo: item.nome, // Renomeia 'nome' para 'tipo'
      quantidade: item.quantidade
    }));

    const tendenciaEventosPorMes = this.helpers.groupByMonth(eventos, 'data_inicio');

    const distribuicaoParticipantes = this.helpers.bucketize(participantesPorEvento, [0, 20, 50, 100, Infinity]);

    const ocupacaoEventos = eventos
      .filter(e => e.limite_participantes > 0) // Evita divisão por zero
      .map(e => ({
        titulo: e.titulo,
        percentual: parseFloat(((e.numero_participantes / e.limite_participantes) * 100).toFixed(2))
      }))
      .slice(0, 10); // Limita para o gráfico de radar não ficar ilegível

    const estatisticasParticipantes = {
      media: this.stats.average(participantesPorEvento),
      mediana: this.stats.median(participantesPorEvento),
      moda: this.stats.mode(participantesPorEvento),
      variancia: this.stats.variance(participantesPorEvento),
      desviopadrao: this.stats.stdDev(participantesPorEvento)
    };

    const correlacao = this.stats.correlation(horasPorEvento, participantesPorEvento);

    // --- Montagem do Objeto Final ---
    const dados: DashboardData = {
      totalEventos: totalEventos,
      totalParticipantes: totalParticipantes,
      totalPalestrantes: totalPalestrantes,
      totalAtividades: totalAtividades,
      mediaParticipantesPorEvento: estatisticasParticipantes.media,
      mediaHorasPorEvento: this.stats.average(horasPorEvento),
      eventosMaisPopulares: eventosMaisPopulares,
      categoriasComMaisEventos: categoriasComMaisEventos,
      distribuicaoParticipantes: distribuicaoParticipantes,
      tendenciaEventosPorMes: tendenciaEventosPorMes,
      ocupacaoEventos: ocupacaoEventos,
      atividadesPorTipo: atividadesPorTipo,
      estatisticasParticipantes: estatisticasParticipantes,
      correlacaoHorasParticipantes: isNaN(correlacao) ? 0 : correlacao
    };

    return dados;
  }

  private getDadosZerados(): DashboardData {
    return {
      totalEventos: 0,
      totalParticipantes: 0,
      totalPalestrantes: 0, // Poderia manter o total geral
      totalAtividades: 0,
      mediaParticipantesPorEvento: 0,
      mediaHorasPorEvento: 0,
      eventosMaisPopulares: [],
      categoriasComMaisEventos: [],
      distribuicaoParticipantes: [],
      tendenciaEventosPorMes: [],
      ocupacaoEventos: [],
      atividadesPorTipo: [],
      estatisticasParticipantes: { media: 0, mediana: 0, moda: 0, variancia: 0, desviopadrao: 0 },
      correlacaoHorasParticipantes: 0
    };
  }


  // ### HELPERS DE CÁLCULO ###

  private stats = {
    sum: (arr: number[]): number => arr.reduce((acc, val) => acc + val, 0),

    average: (arr: number[]): number => {
      if (arr.length === 0) return 0;
      return this.stats.sum(arr) / arr.length;
    },

    median: (arr: number[]): number => {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    mode: (arr: number[]): number => {
      if (arr.length === 0) return 0;
      const counts: { [key: number]: number } = {};
      arr.forEach(val => { counts[val] = (counts[val] || 0) + 1; });
      let maxFreq = 0;
      let mode = NaN;
      for (const val in counts) {
        if (counts[val] >= maxFreq) {
          maxFreq = counts[val];
          mode = Number(val);
        }
      }
      return mode;
    },

    variance: (arr: number[]): number => {
      if (arr.length < 1) return 0;
      const mean = this.stats.average(arr);
      return this.stats.sum(arr.map(val => (val - mean) ** 2)) / arr.length;
    },

    stdDev: (arr: number[]): number => Math.sqrt(this.stats.variance(arr)),

    correlation: (arrX: number[], arrY: number[]): number => {
      if (arrX.length !== arrY.length || arrX.length === 0) return 0;
      const n = arrX.length;
      const meanX = this.stats.average(arrX);
      const meanY = this.stats.average(arrY);
      const stdDevX = this.stats.stdDev(arrX);
      const stdDevY = this.stats.stdDev(arrY);

      if (stdDevX === 0 || stdDevY === 0) return 0; // Evita divisão por zero se os dados forem constantes

      let covariance = 0;
      for (let i = 0; i < n; i++) {
        covariance += (arrX[i] - meanX) * (arrY[i] - meanY);
      }

      return covariance / (stdDevX * stdDevY) / n;
    }
  };

  private helpers = {
    groupBy: (arr: any[], key: string): Array<{ nome: string, quantidade: number }> => {
      const counts: { [key: string]: number } = {};
      arr.forEach(item => {
        const val = item[key];
        counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade);
    },

    groupByMonth: (arr: ViewDetalhesEventoDTO[], dateKey: keyof ViewDetalhesEventoDTO): Array<{ mes: string, quantidade: number }> => {
      const counts: { [key: number]: number } = {};
      const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

      arr.forEach(item => {
        const date = new Date(item[dateKey] as string);
        const month = date.getMonth(); // 0-11
        counts[month] = (counts[month] || 0) + 1;
      });

      // Garante que todos os meses (0-11) existam no resultado
      const result = [];
      for (let i = 0; i < 12; i++) {
          result.push({
              mes: monthNames[i],
              quantidade: counts[i] || 0
          });
      }
      // Filtra apenas meses que realmente existem no range de dados para não poluir
      const minMonth = Math.min(...Object.keys(counts).map(Number));
      const maxMonth = Math.max(...Object.keys(counts).map(Number));

      return result.slice(minMonth, maxMonth + 1);
    },

    bucketize: (arr: number[], buckets: number[]): Array<{ faixa: string, quantidade: number }> => {
        const counts: { [key: string]: number } = {};

        // Inicializa os buckets
        for (let i = 0; i < buckets.length - 1; i++) {
            const start = buckets[i];
            const end = buckets[i+1];
            let faixa: string;
            if (end === Infinity) {
                faixa = `${start}+`;
            } else {
                faixa = `${start}-${end}`;
            }
            counts[faixa] = 0;
        }

        // Preenche os buckets
        arr.forEach(val => {
            for (let i = 0; i < buckets.length - 1; i++) {
                const start = buckets[i];
                const end = buckets[i+1];

                if (val >= start && (end === Infinity || val <= end)) {
                     let faixa = (end === Infinity) ? `${start}+` : `${start}-${end}`;
                     counts[faixa]++;
                     break; // Sai do loop interno
                }
            }
        });

        return Object.entries(counts).map(([faixa, quantidade]) => ({ faixa, quantidade }));
    }
  };
}
