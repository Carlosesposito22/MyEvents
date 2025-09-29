import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './create-categoria.html',
  styleUrls: ['../../app.css']
})
export class CreateCategoria {
  @Output() fechar = new EventEmitter<void>();

  categoria = {
    nome: null as string | null,
    descricao: null as string | null,
    id_categoria_pai: null as number | null,
  };

  resultado: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  criarCategoria(): void {
    this.error = '';
    this.resultado = null;
    this.loading = true;
    this.http.post<any>('http://localhost:8080/categoria', this.categoria)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao criar categoria.';
          this.loading = false;
        }
      });
  }
}
