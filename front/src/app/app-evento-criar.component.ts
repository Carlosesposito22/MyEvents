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
    data_inicio: '',
    data_fim: '',
    carga_horaria: 0,
    limite_participantes: 0,
    expectiva_participantes: 0,
    numero_participantes: 0,
    id_categoria: 0,
    email_duvidas: '',
    numero_membros_comissao: 0
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
