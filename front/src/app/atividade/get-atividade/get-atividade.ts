import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-get-atividade',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './get-atividade.html',
  styleUrls: ['../../app.css']
})
export class GetAtividade  {
  @Output() fechar = new EventEmitter<void>();

  atividadeId: number | null = null;
  atividade: any = null; 
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscarAtividade(): void {
    this.error = '';
    this.atividade = null; 

    if (this.atividadeId == null || isNaN(this.atividadeId)) {
      this.error = 'Digite um ID válido.';
      return;
    }

    this.loading = true;
    this.http.get<any>(`http://localhost:8080/atividade/${this.atividadeId}`)
      .subscribe({
        next: (res: any) => {
          this.atividade = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Atividade não encontrada.';
          this.loading = false;
        }
      });
  }
}
