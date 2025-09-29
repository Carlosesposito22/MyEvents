import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-buscar-categoria',
    standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './buscar-categoria.html',
  styleUrls: ['../../app.css']
})
export class BuscarCategoria {
  @Output() fechar = new EventEmitter<void>();

  nome: string = '';
  categorias: any[] | null = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscar(): void {
    this.error = '';
    this.categorias = null;

    if (!this.nome || !this.nome.trim()) {
      this.error = 'Digite um nome para pesquisar!';
      return;
    }

    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/categoria/buscar?nome=${encodeURIComponent(this.nome)}`)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.categorias = null;
            this.error = 'Nenhuma categoria encontrado com esse título.';
          } else {
            this.categorias = res;
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar categorias pelo nome.';
          this.loading = false;
        }
      });
  }
}