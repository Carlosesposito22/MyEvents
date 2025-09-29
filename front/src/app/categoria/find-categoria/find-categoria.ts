import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-find-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './find-categoria.html',
  styleUrls: ['../../app.css']
})
export class FindCategoria {
  @Output() fechar = new EventEmitter<void>();

  categoriaId: number | null = null;
  categoria: any = null;
  id_categoria_pai: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscarCategoria(): void {
    this.error = '';
    this.categoria = null;

    if (this.categoriaId == null || isNaN(this.categoriaId)) {
      this.error = 'Digite um ID válido.';
      return;
    }

    this.loading = true;
    this.http.get<any>(`http://localhost:8080/categoria/${this.categoriaId}`)
      .subscribe({
        next: (res: any) => {
          this.categoria = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Categoria não encontrado.';
          this.loading = false;
        }
      });
  }
}