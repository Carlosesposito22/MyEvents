import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-eventos-por-data',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './app-eventos-por-data.component.html',
  styleUrls: ['../../app.css']
})
export class AppEventosPorDataComponent {
  @Output() fechar = new EventEmitter<void>();

  dataInicio: string = '';
  dataFim: string = '';
  eventos: any[] | null = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscar(): void {
    this.error = '';
    this.eventos = null;
    if (!this.dataInicio || !this.dataFim) {
      this.error = 'Preencha as duas datas!';
      return;
    }
    this.loading = true;
    const params = `?dataInicio=${encodeURIComponent(this.dataInicio)}&dataFim=${encodeURIComponent(this.dataFim)}`;
    this.http.get<any[]>(`http://localhost:8080/evento/buscar-por-data${params}`)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.eventos = null;
            this.error = 'Nenhum evento encontrado no período.';
          } else {
            this.eventos = res;
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar eventos por data.';
          this.loading = false;
        }
      });
  }
}
