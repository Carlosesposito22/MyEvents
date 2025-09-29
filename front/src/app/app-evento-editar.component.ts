import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evento-editar',
  imports: [CommonModule, FormsModule],
  templateUrl: 'app-evento-editar.component.html',
  styleUrls: ['app.css']
})
export class AppEventoEditarComponent {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  idEvento: number | null = null;
  eventoCarregado = false;
  resultado: any = null;
  loading = false;
  carregandoEvento = false;
  error = '';

  evento = {
    titulo: '',
    data_inicio: null as string | null,
    data_fim: null as string | null,
    carga_horaria: null as number | null,
    limite_participantes: null as number | null,
    expectiva_participantes: null as number | null,
    numero_participantes: null as number | null,
    id_categoria: null as number | null,
    numero_membros_comissao: null as number | null,
    email_duvidas: ''
  };

  constructor(private http: HttpClient) {}

  onOverlayClick(){
    if(!this.carregandoEvento && !this.loading){
      this.close();
    }
  }

  close(){
    this.open = false;
    this.eventoCarregado = false;
    this.resultado = null;
    this.error = '';
    this.fechar.emit();
  }

  buscarEvento(){
    if(!this.idEvento){ this.error = 'Informe um ID válido.'; return; }
    this.error = '';
    this.carregandoEvento = true;
    this.eventoCarregado = false;

    this.http.get<any>(`http://localhost:8080/evento/${this.idEvento}`)
      .subscribe({
        next: (res) => {
          this.evento = {
            titulo: res.titulo ?? '',
            data_inicio: res.data_inicio ?? null,
            data_fim: res.data_fim ?? null,
            carga_horaria: res.carga_horaria ?? null,
            limite_participantes: res.limite_participantes ?? null,
            expectiva_participantes: res.expectiva_participantes ?? null,
            numero_participantes: res.numero_participantes ?? null,
            id_categoria: res.id_categoria ?? null,
            numero_membros_comissao: res.numero_membros_comissao ?? null,
            email_duvidas: res.email_duvidas ?? ''
          };
          this.eventoCarregado = true;
          this.carregandoEvento = false;
        },
        error: (err) => {
          this.error = 'Evento não encontrado ou erro ao buscar.';
          this.carregandoEvento = false;
        }
      });
  }

  editarEvento(){
    if(!this.idEvento){ this.error = 'ID inválido.'; return; }
    this.error = '';
    this.loading = true;

    this.http.put<any>(`http://localhost:8080/evento/${this.idEvento}`, this.evento)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao salvar alterações.';
          this.loading = false;
        }
      });
  }
}
