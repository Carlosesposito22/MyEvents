import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-buscar-palestrante',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './buscar-palestrante.html',
  styleUrls: ['../../app.css']
})
export class BuscarPalestrante {
  @Output() fechar = new EventEmitter<void>();

  nome: string = '';
  palestrantes: any[] | null = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscar(): void {
    this.error = '';
    this.palestrantes = null;

    if (!this.nome || !this.nome.trim()) {
      this.error = 'Digite um nome para pesquisar!';
      return;
    }

    this.loading = true;
    
    this.http.get<any[]>(`http://localhost:8080/palestrante/buscar?nome=${encodeURIComponent(this.nome)}`)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.palestrantes = null;
            this.error = 'Nenhum palestrante encontrado com esse nome.';
          } else {
            this.palestrantes = res;
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar palestrantes pelo nome.';
          this.loading = false;
        }
      });
  }
}