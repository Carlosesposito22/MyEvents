import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var google: any;
let googleChartLoader: Promise<void> | null = null;

interface ViewGradeAtividadeDTO {
    id_evento: number;
    evento: string;
    atividade: string;
    descricaoAtividade: string;
    carga_horaria: number;
    tipoAtividade: string;
    palestrante: string;
    bioPalestrante: string;
    linkedin: string;
}

@Component({
  selector: 'app-view-grade-atividades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-grade-atividades.html',
})
export class ViewGradeAtividades implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  @ViewChild('gradeChartContainer') gradeChartContainer!: ElementRef;

  private urlListar = 'http://localhost:8080/consultas/view/grade-atividades';
  private urlBuscar = 'http://localhost:8080/consultas/view/grade-atividades/evento/';

  modo: 'lista' | 'busca' | 'grafico' = 'lista';

  loadingLista = false;
  errorLista = '';
  gradeCompleta: ViewGradeAtividadeDTO[] = [];
  gradeAgrupada = new Map<string, ViewGradeAtividadeDTO[]>();

  loadingBusca = false;
  errorBusca = '';
  idBuscaEvento: string = '';
  atividadesEncontradas: ViewGradeAtividadeDTO[] = [];
  buscaRealizada = false; 

  loadingGrafico = false;
  errorGrafico = '';
  idBuscaGrafico: string = '';
  atividadesParaGrafico: ViewGradeAtividadeDTO[] = [];
  graficoBuscaRealizada = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loadGoogleCharts();
  }

  private loadGoogleCharts(): Promise<void> {
    if (googleChartLoader) {
      return googleChartLoader;
    }
    googleChartLoader = new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.charts) {
        resolve(); return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true; script.defer = true;
      script.onload = () => {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => {
          console.log("Google Charts (Core) carregado.");
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
    if (this.modo === 'lista' && this.gradeCompleta.length === 0 && !this.loadingLista) {
      this.buscarListaEventos();
    }
  }

  buscarListaEventos(): void {
    this.loadingLista = true;
    this.errorLista = '';
    this.http.get<ViewGradeAtividadeDTO[]>(this.urlListar).subscribe({
      next: (lista) => {
        this.gradeCompleta = lista;
        this.agruparGrade();
        this.loadingLista = false;
      },
      error: (err) => {
        this.errorLista = 'Erro ao carregar a grade completa de atividades.';
        this.loadingLista = false;
      }
    });
  }

  agruparGrade(): void {
    this.gradeAgrupada.clear();
    for (const ativ of this.gradeCompleta) {
      const nomeEvento = ativ.evento || 'Evento Desconhecido';
      if (!this.gradeAgrupada.has(nomeEvento)) {
        this.gradeAgrupada.set(nomeEvento, []);
      }
      this.gradeAgrupada.get(nomeEvento)?.push(ativ);
    }
  }

  buscarPorId(): void {
    if (!this.idBuscaEvento) {
      this.errorBusca = 'Por favor, digite um ID de evento.'; return;
    }
    this.loadingBusca = true;
    this.errorBusca = '';
    this.atividadesEncontradas = [];
    this.buscaRealizada = true;

    this.http.get<ViewGradeAtividadeDTO[]>(this.urlBuscar + this.idBuscaEvento).subscribe({
      next: (resultado) => {
        this.atividadesEncontradas = resultado;
        this.loadingBusca = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.atividadesEncontradas = [];
        } else {
          this.errorBusca = 'Erro ao buscar as atividades do evento.';
        }
        this.loadingBusca = false;
      }
    });
  }

  buscarParaGrafico(): void {
    if (!this.idBuscaGrafico) {
      this.errorGrafico = 'Por favor, digite um ID de evento.'; return;
    }
    this.loadingGrafico = true;
    this.errorGrafico = '';
    this.atividadesParaGrafico = [];
    this.graficoBuscaRealizada = true;

    this.http.get<ViewGradeAtividadeDTO[]>(this.urlBuscar + this.idBuscaGrafico).subscribe({
      next: (resultado) => {
        this.atividadesParaGrafico = resultado;
        this.loadingGrafico = false;
        
        if (resultado.length > 0) {
          this.drawPieChart(resultado);
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.atividadesParaGrafico = [];
        } else {
          this.errorGrafico = 'Erro ao buscar dados para o gráfico.';
        }
        this.loadingGrafico = false;
      }
    });
  }

  private processarDadosParaGrafico(atividades: ViewGradeAtividadeDTO[]): any[] {
    const dataArray: any[] = [['Tipo de Atividade', 'Carga Horária Total']];
    
    const mapa = new Map<string, number>();
    for (const ativ of atividades) {
      const tipo = ativ.tipoAtividade || 'Indefinido';
      const horas = (mapa.get(tipo) || 0) + (ativ.carga_horaria || 0);
      mapa.set(tipo, horas);
    }
    
    mapa.forEach((total, tipo) => {
      dataArray.push([tipo, total]);
    });
    
    return dataArray;
  }

  private drawPieChart(dados: ViewGradeAtividadeDTO[]): void {
    this.loadGoogleCharts().then(() => {
      this.cdr.detectChanges();

      setTimeout(() => {
        if (!google || !google.visualization) {
          this.errorGrafico = "Biblioteca de gráficos não está pronta."; return;
        }
        if (!this.gradeChartContainer) {
          console.error("Container do gráfico de pizza não foi encontrado."); return;
        }

        const dataTable = google.visualization.arrayToDataTable(
          this.processarDadosParaGrafico(dados)
        );

        const options = {
          title: 'Distribuição de Carga Horária por Tipo de Atividade',
          fontName: 'system-ui',
          fontSize: 14,
          is3D: true,
          chartArea: { left: 10, top: 50, width: '100%', height: '350px' },
          legend: { position: 'bottom', alignment: 'center' }
        };

        const chart = new google.visualization.PieChart(this.gradeChartContainer.nativeElement);
        chart.draw(dataTable, options);
      }, 0);
    });
  }

  resetState(): void {
    this.modo = 'lista';
    this.loadingLista = false;
    this.errorLista = '';
    this.gradeCompleta = [];
    this.gradeAgrupada.clear();
    
    this.loadingBusca = false;
    this.errorBusca = '';
    this.idBuscaEvento = '';
    this.atividadesEncontradas = [];
    this.buscaRealizada = false;

    this.loadingGrafico = false;
    this.errorGrafico = '';
    this.idBuscaGrafico = '';
    this.atividadesParaGrafico = [];
    this.graficoBuscaRealizada = false;
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.resetState(), 300);
  }
}