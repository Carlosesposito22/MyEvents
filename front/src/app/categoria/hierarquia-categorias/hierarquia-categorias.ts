import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface CategoriaPaiDTO {
  categoria_nome: string;
  pai_nome: string;
}

@Component({
  selector: 'app-hierarquia-categorias ',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hierarquia-categorias.html',
  styleUrls: ['../../app.css']
})
export class HierarquiaCategorias implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  categoriasAgrupadas: { [key: string]: string[] } = {};
  chavesPais: string[] = [];

  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.buscarHierarquia();
    }
  }

  buscarHierarquia(): void {
    this.loading = true;
    this.error = '';

    this.http.get<CategoriaPaiDTO[]>('http://localhost:8080/categoria/hierarquia')
    .subscribe({
      next: (lista) => {
        this.agruparCategorias(lista);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar a hierarquia de categorias.';
        this.loading = false;
      }
    });
  }

  private agruparCategorias(lista: CategoriaPaiDTO[]): void {
    const grupos: { [key: string]: string[] } = {};
    
    for (const item of lista) {
      if (!grupos[item.pai_nome]) {
        grupos[item.pai_nome] = [];
      }
      grupos[item.pai_nome].push(item.categoria_nome);
    }

    this.categoriasAgrupadas = grupos;
    this.chavesPais = Object.keys(grupos).sort((a, b) => {
        if (a === 'Categoria Raiz') return -1;
        if (b === 'Categoria Raiz') return 1;
        return a.localeCompare(b);
    });
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
  }
}