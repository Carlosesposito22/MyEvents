import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-buscar-atividade',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './buscar-atividade.html',
  styleUrls: ['../../app.css']
})
export class BuscarAtividade {
  @Output() fechar = new EventEmitter<void>();

  titulo: string = ''; 
  atividades: any[] | null = null; 
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscar(): void {
    this.error = '';
    this.atividades = null; 

    if (!this.titulo || !this.titulo.trim()) {
      this.error = 'Digite um título para pesquisar!';
      return;
    }

    this.loading = true;
    
    this.http.get<any[]>(`http://localhost:8080/atividade/buscar?titulo=${encodeURIComponent(this.titulo)}`)
      .subscribe({
        next: (res) => {
          if (!res || res.length === 0) {
            this.atividades = null;
            this.error = 'Nenhuma atividade encontrada com esse título.';
          } else {
            this.atividades = res;
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar atividades pelo título.';
          this.loading = false;
        }
      });
  }
}