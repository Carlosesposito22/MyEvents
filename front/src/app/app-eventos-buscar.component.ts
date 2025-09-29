import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-eventos-buscar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './app-eventos-buscar.component.html',
  styleUrls: ['./app.css']
})
export class AppEventosBuscarComponent {
  @Output() fechar = new EventEmitter<void>();

  titulo: string = '';
  eventos: any[] | null = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscar(): void {
    this.error = '';
    this.eventos = null;
    if (!this.titulo || !this.titulo.trim()) {
      this.error = 'Digite um título para pesquisar!';
      return;
    }
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/evento/buscar?titulo=${encodeURIComponent(this.titulo)}`)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.eventos = null;
            this.error = 'Nenhum evento encontrado com esse título.';
          } else {
            this.eventos = res;
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar eventos pelo título.';
          this.loading = false;
        }
      });
  }
}
