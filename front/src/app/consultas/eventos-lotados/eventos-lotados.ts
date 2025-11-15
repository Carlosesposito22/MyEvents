import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
declare var google: any;
let googleChartLoader: Promise<void> | null = null;

export interface EventoLotadoDTO {
  id_evento: number;
  nome_evento: string;
  data_inicio: string;
  statusEvento: string;
  numero_participantes: number;
  limite_participantes: number;
}

@Component({
  selector: 'app-eventos-lotados',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './eventos-lotados.html',
})
export class EventosLotados implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();
  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;

  eventos: EventoLotadoDTO[] = [];
  modo: 'lista' | 'busca' | 'grafico' = 'lista';
  loading = false;
  error = '';

  // Busca por ID:
  idBusca: string = '';
  idBuscado: string = '';
  eventoEncontrado: EventoLotadoDTO | null = null;
  loadingBusca = false;
  errorBusca = '';
  buscaRealizada = false;

  // Dados para o gráfico de proporção
  totalEventos: number = 0;
  totalLotados: number = 0;

  private readonly urlLista = 'http://localhost:8080/consultas/view/eventos-lotados';
  private readonly urlPorId = 'http://localhost:8080/consultas/view/status-evento-lotacao/evento/';
  private readonly urlTodosEventos = 'http://localhost:8080/consultas/view/detalhes-eventos';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.loadGoogleCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.resetState();
      this.fetchAllDados();
    }
  }

  setModo(modo: 'lista' | 'busca' | 'grafico') {
    this.modo = modo;
    if ((modo === 'grafico' || modo === 'lista') && !this.loading && this.totalEventos === 0) {
      this.fetchAllDados();
    } else if (modo === 'grafico' && !this.loading) {
      this.drawChart();
    }
  }

  /**
   * Busca eventos lotados E todos os eventos para usar na lista e no gráfico
   */
  fetchAllDados() {
    this.loading = true;
    this.error = '';
    forkJoin([
      this.http.get<any[]>(this.urlTodosEventos),
      this.http.get<EventoLotadoDTO[]>(this.urlLista)
    ]).subscribe({
      next: ([todos, lotados]) => {
        this.totalEventos = todos.length;
        this.totalLotados = lotados.length;
        this.eventos = lotados; // segue sendo só lotados na lista
        this.loading = false;
        if (this.modo === 'grafico') this.drawChart();
      },
      error: (err) => {
        this.error = 'Erro ao buscar eventos para o gráfico.';
        this.loading = false;
      }
    });
  }

  // --- Busca por ID ---
  buscarPorId(): void {
    if (!this.idBusca) {
      this.errorBusca = 'Por favor, digite um ID.';
      return;
    }
    this.loadingBusca = true;
    this.errorBusca = '';
    this.eventoEncontrado = null;
    this.buscaRealizada = true;
    this.idBuscado = this.idBusca;
    this.http.get<EventoLotadoDTO>(this.urlPorId + this.idBusca).subscribe({
      next: (resultado) => {
        this.eventoEncontrado = resultado;
        this.loadingBusca = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.eventoEncontrado = null;
        } else {
          this.errorBusca = 'Erro ao buscar o evento.';
        }
        this.loadingBusca = false;
      }
    });
  }

  /** G R Á F I C O **/
  /**
   * Prepara dados para gráfico - fatias: lotados x não lotados
   */
  private processarDadosGraficoProporcao(): any[] {
    return [
      ['Tipo', 'Quantidade'],
      ['Eventos Lotados', this.totalLotados],
      ['Outros Eventos', this.totalEventos - this.totalLotados]
    ];
  }

  private loadGoogleCharts(): Promise<void> {
    if (googleChartLoader) {
      return googleChartLoader;
    }
    googleChartLoader = new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.charts) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => {
          resolve();
        });
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
    return googleChartLoader;
  }

  private drawChart(): void {
    this.loadGoogleCharts().then(() => {
      this.cdr.detectChanges();
      setTimeout(() => {
        if (!google || !google.visualization) return;
        if (!this.pieChartContainer) return;

        const dataTable = google.visualization.arrayToDataTable(
          this.processarDadosGraficoProporcao()
        );
        const options = {
          title: 'Proporção de Eventos Lotados',
          fontName: 'system-ui',
          fontSize: 14,
          is3D: true,
          chartArea: { left: 10, top: 50, width: '100%', height: '350px' },
          legend: { position: 'bottom', alignment: 'center' }
        };
        const chart = new google.visualization.PieChart(this.pieChartContainer.nativeElement);
        chart.draw(dataTable, options);
      }, 0);
    });
  }

  resetState(): void {
    this.modo = 'lista';
    this.eventos = [];
    this.loading = false;
    this.error = '';
    this.loadingBusca = false;
    this.errorBusca = '';
    this.idBusca = '';
    this.idBuscado = '';
    this.eventoEncontrado = null;
    this.buscaRealizada = false;
    this.totalEventos = 0;
    this.totalLotados = 0;
  }

  close() {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.resetState(), 300);
  }
}
