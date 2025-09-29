import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-evento-criar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './app-evento-criar.component.html',
  styleUrls: ['./app.css']
})
export class AppEventoCriarComponent {
  @Output() fechar = new EventEmitter<void>();

  evento = {
    titulo: '',
    data_inicio: null as string | null,
    data_fim: null as string | null,
    carga_horaria: null as number | null,
    limite_participantes: null as number | null,
    expectiva_participantes: null as number | null,
    numero_participantes: null as number | null,
    id_categoria: null as number | null,
    email_duvidas: '',
    numero_membros_comissao: null as number | null
  };
  resultado: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  criarEvento(): void {
    this.error = '';
    this.resultado = null;
    this.loading = true;
    this.http.post<any>('http://localhost:8080/evento', this.evento)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao criar evento.';
          this.loading = false;
        }
      });
  }
}
