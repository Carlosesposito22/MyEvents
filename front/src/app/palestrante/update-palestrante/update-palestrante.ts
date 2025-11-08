import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-palestrante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-palestrante.html',
  styleUrls: ['../../app.css']
})
export class UpdatePalestrante {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  idPalestrante: number | null = null;
  palestranteCarregado = false;
  resultado: any = null;
  loading = false;
  carregandoPalestrante = false;
  error = '';

  palestrante = {
    nome: null as string | null,
    email: null as string | null,
    biografia: null as string | null,
    linkedin: null as string | null,
    lattes: null as string | null,
  };

  constructor(private http: HttpClient) {}

  onOverlayClick(){
    if(!this.carregandoPalestrante && !this.loading){
      this.close();
    }
  }

  close(){
    this.open = false;
    this.palestranteCarregado = false;
    this.resultado = null;
    this.error = '';
    this.idPalestrante = null;
    this.fechar.emit();
  }

  buscarPalestrante(){
    if(!this.idPalestrante){ this.error = 'Informe um ID válido.'; return; }
    this.error = '';
    this.carregandoPalestrante = true;
    this.palestranteCarregado = false;

    this.http.get<any>(`http://localhost:8080/palestrante/${this.idPalestrante}`)
      .subscribe({
        next: (res) => {
          this.palestrante = {
            nome: res.nome ?? '',
            email: res.email ?? null,
            biografia: res.biografia ?? null,
            linkedin: res.linkedin ?? null,
            lattes: res.lattes ?? null,
          };
          this.palestranteCarregado = true;
          this.carregandoPalestrante = false;
        },
        error: (err) => {
          this.error = 'Palestrante não encontrado.';
          this.carregandoPalestrante = false;
        }
      });
  }

  editarPalestrante(){
    if(!this.idPalestrante){ this.error = 'ID inválido.'; return; }
    this.error = '';
    this.loading = true;

    this.http.put<any>(`http://localhost:8080/palestrante/${this.idPalestrante}`, this.palestrante)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao salvar alterações. Verifique campos únicos (email, lattes, linkedin).';
          this.loading = false;
        }
      });
  }
}