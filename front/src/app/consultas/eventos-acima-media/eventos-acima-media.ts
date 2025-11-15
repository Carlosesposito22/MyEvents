import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare var google: any;

interface EventoAcimaMediaDTO {
  id_evento: number;
  titulo: string;
  numero_participantes: number;
  expectativa_participantes: number;
}

let googleChartLoader: Promise<void> | null = null;

@Component({
  selector: 'app-eventos-acima-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos-acima-media.html',
  styleUrls: ['../../app.css']
})
export class EventosAcimaMedia implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  loading = false;
  error = '';
  eventos: EventoAcimaMediaDTO[] = [];

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
        console.error("Erro ao carregar Google Charts:", error);
        this.error = "Erro ao carregar biblioteca de gráficos.";
        reject(error);
      };

      document.head.appendChild(script);
    });

    return googleChartLoader;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.buscarEdesenhar();
    }
  }

  async buscarEdesenhar(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.eventos = [];
    this.cdr.detectChanges();

    try {
      const [_, dados] = await Promise.all([
        this.loadGoogleCharts(),
        this.http.get<EventoAcimaMediaDTO[]>('http://localhost:8080/consultas/eventos-acima-media').toPromise()
      ]);

      this.eventos = dados || [];
      this.loading = false;

      this.cdr.detectChanges();

      if (this.eventos.length > 0) {
        setTimeout(() => {
          this.drawChart(this.eventos);
        }, 0);
      }

    } catch (err) {
      this.error = 'Erro ao carregar os eventos acima da média.';
      console.error(err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private drawChart(dados: EventoAcimaMediaDTO[]): void {
    if (!google || !google.visualization) {
      this.error = "Biblioteca de gráficos não está pronta.";
      return;
    }
    if (!this.chartContainer) {
      this.error = "Container do gráfico não encontrado.";
      return;
    }

    const dataArray: any[] = [
      ['Evento', 'Participantes Reais', 'Expectativa']
    ];

    dados.forEach(evento => {
      dataArray.push([
        evento.titulo,
        evento.numero_participantes,
        evento.expectativa_participantes
      ]);
    });

    const dataTable = google.visualization.arrayToDataTable(dataArray);

    const options = {
      title: 'Performance de Eventos (Real vs. Expectativa)',
      chartArea: { width: '60%', height: '80%' },
      hAxis: {
        title: 'Número de Participantes',
        minValue: 0,
      },
      vAxis: {
        title: 'Evento'
      },
      bars: 'vertical',
      legend: { position: 'top' },
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true,
      },
      colors: ['#007acc', '#ffc107']
    };

    const chart = new google.visualization.BarChart(this.chartContainer.nativeElement);
    chart.draw(dataTable, options);
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
  }
}
