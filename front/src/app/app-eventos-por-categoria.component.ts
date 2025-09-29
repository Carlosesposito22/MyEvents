import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-eventos-por-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './app-eventos-por-categoria.component.html',
  styleUrls: ['./app.css']
})
export class AppEventosPorCategoriaComponent {
  @Output() fechar = new EventEmitter<void>();

  idCategoria: number | null = null;
  eventos: any[] | null = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscar(): void {
    this.error = '';
    this.eventos = null;
    if (this.idCategoria == null || isNaN(this.idCategoria)) {
      this.error = 'Digite um ID de categoria válido.';
      return;
    }
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/evento/por-categoria/${this.idCategoria}`)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.eventos = null;
            this.error = 'Nenhum evento encontrado para essa categoria.';
          } else {
            this.eventos = res;
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar eventos para essa categoria.';
          this.loading = false;
        }
      });
  }
}
