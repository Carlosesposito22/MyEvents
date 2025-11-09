import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

interface AtividadeFiltradaDTO {
  id_atividade: number;
  tituloAtividade: string;
  tituloEvento: string;
}

@Component({
  selector: 'app-atividades-filtradas',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './atividades-filtradas.html',
  styleUrls: ['../../app.css'] 
})
export class AtividadesFiltradas {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  nomeCategoria: string = '';
  dataInicio: string = '';
  dataFim: string = '';

  loading = false;
  error = '';
  atividades: AtividadeFiltradaDTO[] = [];
  buscaRealizada = false;

  private apiUrl = 'http://localhost:8080/consultas/atividades-filtradas'; 

  constructor(private http: HttpClient) {}

  buscarAtividades(): void {
    // 1. Validação
    if (!this.nomeCategoria || !this.dataInicio || !this.dataFim) {
      this.error = 'Por favor, preencha todos os campos do filtro.';
      this.buscaRealizada = false; 
      return;
    }

    this.loading = true;
    this.error = '';
    this.atividades = [];
    this.buscaRealizada = true;

    let params = new HttpParams()
      .set('categoria', this.nomeCategoria)
      .set('inicio', this.dataInicio)
      .set('fim', this.dataFim);

    this.http.get<AtividadeFiltradaDTO[]>(this.apiUrl, { params: params })
    .subscribe({
      next: (lista) => {
        this.atividades = lista;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao buscar atividades. Verifique os dados e tente novamente.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
    
    this.atividades = [];
    this.nomeCategoria = '';
    this.dataInicio = '';
    this.dataFim = '';
    this.loading = false;
    this.error = '';
    this.buscaRealizada = false;
  }
}