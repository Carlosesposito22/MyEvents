import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-atividade', 
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-atividade.html',
  styleUrls: ['../../app.css']
})
export class UpdateAtividade {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  idAtividade: number | null = null; 
  atividadeCarregada = false; 
  resultado: any = null;
  loading = false; 
  carregandoAtividade = false;
  error = '';

  atividade = {
    titulo: null as string | null,
    descricao: null as string | null,
    limite_vagas: null as number | null,
    link_transmissao_atividade: null as string | null,
    carga_horaria: null as number | null,
    id_evento: null as number | null,
    id_tipoAtividade: null as number | null,
  };

  constructor(private http: HttpClient) {}

  onOverlayClick(){
    if(!this.carregandoAtividade && !this.loading){
      this.close();
    }
  }

  close(){
    this.open = false;
    this.atividadeCarregada = false;
    this.resultado = null;
    this.error = '';
    this.idAtividade = null;
    this.fechar.emit();
  }

  buscarAtividade(){
    if(!this.idAtividade){ this.error = 'Informe um ID válido.'; return; }
    this.error = '';
    this.carregandoAtividade = true;
    this.atividadeCarregada = false;

    this.http.get<any>(`http://localhost:8080/atividade/${this.idAtividade}`)
      .subscribe({
        next: (res) => {
          this.atividade = {
            titulo: res.titulo ?? '',
            descricao: res.descricao ?? null,
            limite_vagas: res.limite_vagas ?? null,
            link_transmissao_atividade: res.link_transmissao_atividade ?? null,
            carga_horaria: res.carga_horaria ?? null,
            id_evento: res.id_evento ?? null,
            id_tipoAtividade: res.id_tipoAtividade ?? null,
          };
          this.atividadeCarregada = true; 
          this.carregandoAtividade = false; 
        },
        error: (err) => {
          this.error = 'Atividade não encontrada.'; 
          this.carregandoAtividade = false;
        }
      });
  }

  editarAtividade(){ 
    if(!this.idAtividade){ this.error = 'ID inválido.'; return; }
    this.error = '';
    this.loading = true;

    this.http.put<any>(`http://localhost:8080/atividade/${this.idAtividade}`, this.atividade)
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