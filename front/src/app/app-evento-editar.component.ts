import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evento-editar',
  imports: [CommonModule, FormsModule],
  templateUrl: 'app-evento-editar.component.html',
  styles: [`
    .modal-overlay{
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 20px;
    }
    .modal-content{
      background: #fff;
      border-radius: 8px;
      max-width: 820px;
      width: 100%;
      padding: 18px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.28);
      position: relative;
    }
    .modal-close{
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 1.15rem;
      cursor: pointer;
    }
    .titulo-pagina{ margin: 4px 0 12px 0; font-size: 1.4rem; }

    .evento-form-row{ display:flex; flex-direction: column; gap: 12px; }
    .form-row-two{ display:flex; gap:12px; }
    .form-row-search{ display:flex; gap:10px; align-items:center; margin-bottom:10px; }
    .form-group{ display:flex; flex-direction:column; flex:1; }
    .form-group label{ font-size: 0.95rem; margin-bottom:6px; }
    .evento-input{ width:100%; padding:8px 10px; border-radius:6px; border:1px solid #d0d7de; box-sizing:border-box; }
    .modal-footer{ display:flex; justify-content:flex-end; margin-top:6px; }
    .evento-btn{ background:#4aa0ff; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; }
    .evento-erro{ color:#9b1c1c; margin-top:6px; }
    .loading{ color:#333; display:flex; gap:6px; align-items:center; }
    .spinner{ width:12px;height:12px;border-radius:50%;border:2px solid #ccc;border-top-color:#333; animation:spin 0.8s linear infinite; display:inline-block; }
    @keyframes spin{ to{ transform:rotate(360deg) } }

    .sucesso-box{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:14px; min-height:100px; }
    .sucesso-icone{ font-size:2.1rem; color:#1ec773; }
    .sucesso-texto{ font-weight:700; color:#0084ff; font-size:1.1rem; }
  `]
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
