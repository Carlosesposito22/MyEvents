import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Categoria {
  id_categoria: number;
  nome: string;
  descricao: string;
  id_categoria_pai: number;
}

@Component({
  selector: 'app-buscar-subcategorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-subcategorias.html',
  styleUrls: ['../../app.css']
})
export class BuscarSubcategoriasComponent {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  idCategoriaPai: number | null = null;
  subcategorias: Categoria[] = [];
  
  loading = false;
  error = '';
  buscaRealizada = false;

  constructor(private http: HttpClient) {}

  buscarSubcategorias(): void {
    if (!this.idCategoriaPai) {
      this.error = 'Por favor, informe o ID da categoria pai.';
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.subcategorias = []; 
    this.buscaRealizada = false;

    const url = `http://localhost:8080/categoria/${this.idCategoriaPai}/subcategorias`;

    this.http.get<Categoria[]>(url).subscribe({
      next: (resultado) => {
        this.subcategorias = resultado;
        this.loading = false;
        this.buscaRealizada = true;
      },
      error: (err) => {
        this.error = 'Erro ao buscar subcategorias. Verifique o Id';
        this.loading = false;
        this.buscaRealizada = true;
      }
    });
  }

  close(): void {
    this.open = false;
    this.idCategoriaPai = null;
    this.subcategorias = [];
    this.error = '';
    this.buscaRealizada = false;
    this.fechar.emit();
  }
}