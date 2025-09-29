import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-evento-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './app-evento-editar.component.html'
})
export class AppEventoEditarComponent {
  @Output() fechar = new EventEmitter<void>();

  idEvento: number | null = null;
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
  carregandoEvento: boolean = false;
  eventoCarregado: boolean = false;

  constructor(private http: HttpClient) {}

  buscarEvento() {
    this.error = '';
    this.resultado = null;
    this.eventoCarregado = false;
    if (this.idEvento == null || isNaN(this.idEvento)) {
      this.error = 'Informe um ID numérico do evento!';
      return;
    }
    this.carregandoEvento = true;
    this.http.get<any>(`http://localhost:8080/evento/${this.idEvento}`)
      .subscribe({
        next: (evento) => {
          if (!evento) {
            this.error = 'Evento não encontrado.';
            this.carregandoEvento = false;
            return;
          }
          this.evento = {
            titulo: evento.titulo || '',
            data_inicio: evento.data_inicio || '',
            data_fim: evento.data_fim || '',
            carga_horaria: evento.carga_horaria || 0,
            limite_participantes: evento.limite_participantes || 0,
            expectiva_participantes: evento.expectiva_participantes || 0,
            numero_participantes: evento.numero_participantes || 0,
            id_categoria: evento.id_categoria || 0,
            email_duvidas: evento.email_duvidas || '',
            numero_membros_comissao: evento.numero_membros_comissao || 0
          };
          this.eventoCarregado = true;
          this.carregandoEvento = false;
        },
        error: (_) => {
          this.error = 'Evento não encontrado.';
          this.carregandoEvento = false;
        }
      });
  }

  editarEvento(): void {
    this.error = '';
    this.resultado = null;
    if (!this.idEvento || !this.eventoCarregado) {
      this.error = 'Busque e carregue um evento primeiro!';
      return;
    }
    this.loading = true;
    this.http.put<any>(`http://localhost:8080/evento/${this.idEvento}`, this.evento)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao editar evento.';
          this.loading = false;
        }
      });
  }
}
