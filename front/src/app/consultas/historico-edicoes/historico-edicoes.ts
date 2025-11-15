import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface EventoAtualizacaoLogDTO {
  id_log: number;
  id_evento: number;
  campo_alterado: string;
  valor_antigo: string;
  valor_novo: string;
  data_alteracao: string; // ISO
}

@Component({
  selector: 'app-historico-edicoes',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './historico-edicoes.html',
})
export class HistoricoEdicoes implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  modo: 'lista' | 'busca' = 'lista';

  // Listar todos
  logs: EventoAtualizacaoLogDTO[] = [];
  loading = false;
  error = '';

  // Busca por evento
  idBusca: string = '';
  loadingBusca = false;
  buscaRealizada = false;
  logsEvento: EventoAtualizacaoLogDTO[] = [];
  errorBusca = '';
  idBuscado = '';

  private readonly urlTodos = 'http://localhost:8080/consultas/evento-atualizacao/logs';
  private readonly urlPorEvento = 'http://localhost:8080/consultas/evento-atualizacao/logs/';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.reset();
      this.buscarTodos();
    }
  }

  setModo(m: 'lista' | 'busca') {
    this.modo = m;
    if (m === 'lista' && this.logs.length === 0 && !this.loading) this.buscarTodos();
  }

  buscarTodos() {
    this.error = '';
    this.loading = true;
    this.logs = [];
    this.http.get<EventoAtualizacaoLogDTO[]>(this.urlTodos).subscribe({
      next: r => { this.logs = r; this.loading = false; },
      error: () => { this.error = 'Erro ao carregar histórico.'; this.loading = false; }
    });
  }

  buscarPorEvento() {
    this.errorBusca = '';
    if (!this.idBusca) {
      this.errorBusca = 'Digite o ID do evento.';
      return;
    }
    this.loadingBusca = true;
    this.buscaRealizada = true;
    this.logsEvento = [];
    this.idBuscado = this.idBusca;
    this.http.get<EventoAtualizacaoLogDTO[]>(this.urlPorEvento + this.idBusca).subscribe({
      next: r => { this.logsEvento = r; this.loadingBusca = false; },
      error: err => {
        if (err.status === 404) this.logsEvento = [];
        else this.errorBusca = "Erro ao buscar logs do evento.";
        this.loadingBusca = false;
      }
    });
  }

  reset() {
    this.modo = 'lista';
    this.logs = [];
    this.loading = false;
    this.error = '';
    this.idBusca = '';
    this.loadingBusca = false;
    this.buscaRealizada = false;
    this.logsEvento = [];
    this.errorBusca = '';
    this.idBuscado = '';
  }

  close() {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.reset(), 300);
  }
}
