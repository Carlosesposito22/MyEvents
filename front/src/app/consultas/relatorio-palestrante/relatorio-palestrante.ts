import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface RelatorioPalestranteDTO {
  id_palestrante: number;
  nome_palestrante: string;
  resumo: string;
}

@Component({
  selector: 'app-relatorio-palestrante',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './relatorio-palestrante.html',
})
export class RelatorioPalestrante implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  modo: 'lista' | 'individual' = 'lista';

  // Aba Listar Todos
  relatorio: RelatorioPalestranteDTO[] = [];
  loading = false;
  error = '';

  // Aba individual (busca)
  idBusca: string = '';
  loadingBusca = false;
  buscaRealizada = false;
  relatorioIndividual: RelatorioPalestranteDTO | null = null;
  errorBusca = '';
  idBuscado = '';

  baixarCSV() {
    if (!this.relatorio.length) return;

    const separador = ';'; // ou ',' se preferir
    const header = 'ID;Palestrante;Resumo dos Eventos';

    const linhas = this.relatorio.map(p =>
      [
        p.id_palestrante,
        `"${p.nome_palestrante.replace(/"/g, '""')}"`,
        `"${(p.resumo || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`
      ].join(separador)
    );

    const csv = [header, ...linhas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'relatorio-palestrantes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private readonly urlTodos = 'http://localhost:8080/consultas/resumo-eventos-palestrantes';
  private readonly urlIndividual = 'http://localhost:8080/consultas/resumo-eventos-palestrante/';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.reset();
      this.buscarTodos();
    }
  }

  setModo(m: 'lista' | 'individual') {
    this.modo = m;
    if (m === 'lista' && this.relatorio.length === 0 && !this.loading) this.buscarTodos();
  }

  buscarTodos() {
    this.error = '';
    this.loading = true;
    this.relatorio = [];
    this.http.get<RelatorioPalestranteDTO[]>(this.urlTodos).subscribe({
      next: r => { this.relatorio = r; this.loading = false; },
      error: () => { this.error = 'Erro ao carregar relatório dos palestrantes.'; this.loading = false; }
    });
  }

  buscarIndividual() {
    this.errorBusca = '';
    if (!this.idBusca) {
      this.errorBusca = 'Digite o ID do palestrante.';
      return;
    }
    this.loadingBusca = true;
    this.buscaRealizada = true;
    this.relatorioIndividual = null;
    this.idBuscado = this.idBusca;
    this.http.get<RelatorioPalestranteDTO>(this.urlIndividual + this.idBusca).subscribe({
      next: r => { this.relatorioIndividual = r; this.loadingBusca = false; },
      error: err => {
        if (err.status === 404) this.relatorioIndividual = null;
        else this.errorBusca = "Erro ao buscar o palestrante.";
        this.loadingBusca = false;
      }
    })
  }

  reset() {
    this.modo = 'lista';
    this.relatorio = [];
    this.loading = false;
    this.error = '';
    this.idBusca = '';
    this.loadingBusca = false;
    this.buscaRealizada = false;
    this.relatorioIndividual = null;
    this.errorBusca = '';
    this.idBuscado = '';
  }

  close() {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.reset(), 300);
  }
}
