import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-atividade',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './create-atividade.html',
  styleUrls: ['../../app.css']
})
export class CreateAtividade {
  @Output() fechar = new EventEmitter<void>();

  atividade = {
    titulo: null as string | null,
    descricao: null as string | null,
    limite_vagas: null as number | null,
    link_transmissao_atividade: null as string | null,
    carga_horaria: null as number | null,
    id_evento: null as number | null,
    id_tipoAtividade: null as number | null,
  };

  resultado: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  criarAtividade(): void {
    this.error = '';
    this.resultado = null;
    this.loading = true;

    this.http.post<any>('http://localhost:8080/atividade', this.atividade)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao criar atividade.';
          this.loading = false;
        }
      });
  }
}