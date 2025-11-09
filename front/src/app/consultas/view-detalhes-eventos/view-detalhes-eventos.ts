import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var google: any;
let googleChartLoader: Promise<void> | null = null;

interface ViewDetalhesEventoDTO {
    id_evento: number;
    titulo: string;
    data_inicio: string;
    data_fim: string;
    numero_participantes: number;
    limite_participantes: number;
    carga_horaria: number;
    nomeCategoria: string;
    nomeLocal: string | null;
    cidade: string | null;
    estado: string | null;
    rua: string | null;
    numeroLocal: number | null;
    url_evento: string | null;
    aplicativoTrasmissao: string | null;
    qtd_atividades: number;
    qtd_palestrantes: number; 
}

@Component({
  selector: 'app-view-detalhes-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-detalhes-eventos.html',
})
export class ViewDetalhesEventos implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  @ViewChild('pieChartContainer') pieChartContainer!: ElementRef;

  private urlListar = 'http://localhost:8080/consultas/view/detalhes-eventos';
  private urlBuscar = 'http://localhost:8080/consultas/view/detalhes-eventos/';

  modo: 'lista' | 'busca' | 'grafico' = 'lista';

  loadingLista = false;
  errorLista = '';
  eventos: ViewDetalhesEventoDTO[] = [];

  loadingBusca = false;
  errorBusca = '';
  idBusca: string = '';
  idBuscado: string = ''; 
  eventoEncontrado: ViewDetalhesEventoDTO | null = null;
  buscaRealizada = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.loadGoogleCharts(); 
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
          console.log("Google Charts carregado.");
          resolve();
        });
      };
      script.onerror = (error) => {
        this.errorLista = "Erro ao carregar biblioteca de gráficos.";
        reject(error);
      };
      document.head.appendChild(script);
    });
    return googleChartLoader;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.resetState();
      this.buscarListaEventos();
    }
  }

  setModo(modo: 'lista' | 'busca' | 'grafico'): void {
    this.modo = modo;
    if (this.modo === 'grafico' && this.eventos.length > 0 && !this.loadingLista) {
      this.drawChart(this.eventos);
    }
    if (this.modo === 'lista' && this.eventos.length === 0 && !this.loadingLista) {
      this.buscarListaEventos();
    }
  }

  buscarListaEventos(): void {
    this.loadingLista = true;
    this.errorLista = '';
    this.http.get<ViewDetalhesEventoDTO[]>(this.urlListar).subscribe({
      next: (lista) => {
        this.eventos = lista;
        this.loadingLista = false;
      },
      error: (err) => {
        this.errorLista = 'Erro ao carregar a lista de eventos da view.';
        console.error(err);
        this.loadingLista = false;
      }
    });
  }

  private processarDadosParaGrafico(eventos: ViewDetalhesEventoDTO[]): any[] {
    const dataArray: any[] = [['Categoria', 'Total de Participantes']];
    
    const mapa = new Map<string, number>();
    for (const evento of eventos) {
      const categoria = evento.nomeCategoria || 'Sem Categoria';
      const participantes = (mapa.get(categoria) || 0) + evento.numero_participantes;
      mapa.set(categoria, participantes);
    }
    
    mapa.forEach((total, categoria) => {
      dataArray.push([categoria, total]);
    });
    
    return dataArray;
  }

  private drawChart(dados: ViewDetalhesEventoDTO[]): void {
    this.loadGoogleCharts().then(() => {
      this.cdr.detectChanges(); 

      setTimeout(() => {
        if (!google || !google.visualization) {
          this.errorLista = "Biblioteca de gráficos não está pronta."; return;
        }
        if (!this.pieChartContainer) {
          console.error("Container do gráfico de pizza não foi encontrado."); return;
        }

        const dataTable = google.visualization.arrayToDataTable(
          this.processarDadosParaGrafico(dados)
        );

        const options = {
          title: 'Total de Participantes por Categoria',
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
    this.http.get<ViewDetalhesEventoDTO>(this.urlBuscar + this.idBusca).subscribe({
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

  resetState(): void {
    this.modo = 'lista';
    this.eventos = [];
    this.loadingLista = false;
    this.errorLista = '';
    this.loadingBusca = false;
    this.errorBusca = '';
    this.idBusca = '';
    this.idBuscado = '';
    this.eventoEncontrado = null;
    this.buscaRealizada = false;
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.resetState(), 300);
  }
}