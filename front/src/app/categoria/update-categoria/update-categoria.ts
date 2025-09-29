import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-categoria.html',
  styleUrls: ['../../app.css']
})
export class UpdateCategoria {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  idCategoria: number | null = null;
  categoriaCarregado = false;
  resultado: any = null;
  loading = false;
  carregandoCategoria = false;
  error = '';

  categoria = {
    nome: null as string | null,
    descricao: null as string | null,
    id_categoria_pai: null as number | null,
  };

  constructor(private http: HttpClient) {}

  onOverlayClick(){
    if(!this.carregandoCategoria && !this.loading){
      this.close();
    }
  }

  close(){
    this.open = false;
    this.categoriaCarregado = false;
    this.resultado = null;
    this.error = '';
    this.fechar.emit();
  }

  buscarCategoria(){
    if(!this.idCategoria){ this.error = 'Informe um ID válido.'; return; }
    this.error = '';
    this.carregandoCategoria = true;
    this.categoriaCarregado = false;

    this.http.get<any>(`http://localhost:8080/categoria/${this.idCategoria}`)
      .subscribe({
        next: (res) => {
          this.categoria = {
            nome: res.nome ?? '',
            descricao: res.descricao ?? null,
            id_categoria_pai: res.id_categoria_pai ?? null,
          };
          this.categoriaCarregado = true;
          this.carregandoCategoria = false;
        },
        error: (err) => {
          this.error = 'Categoria não encontrada.';
          this.carregandoCategoria = false;
        }
      });
  }

  editarCategoria(){
    if(!this.idCategoria){ this.error = 'ID inválido.'; return; }
    this.error = '';
    this.loading = true;

    this.http.put<any>(`http://localhost:8080/categoria/${this.idCategoria}`, this.categoria)
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
