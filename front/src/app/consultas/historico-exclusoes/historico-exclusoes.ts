import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface EventoExclusaoLogDTO {
  id_log: number;
  id_evento: number;
  titulo: string;
  data_inicio: string;
  data_fim: string;
  numero_participantes: number;
  limite_participantes: number;
  id_categoria: number;
  email_duvidas: string;
  numero_membros_comissao: number;
  data_exclusao: string; // ISO string
  usuario_acao: string;
}

@Component({
  selector: 'app-historico-exclusoes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './historico-exclusoes.html',
})
export class HistoricoExclusoes implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  logs: EventoExclusaoLogDTO[] = [];
  loading = false;
  error = '';

  private readonly url = 'http://localhost:8080/consultas/evento-exclusao/logs';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.reset();
      this.buscarTodos();
    }
  }

  buscarTodos() {
    this.error = '';
    this.loading = true;
    this.logs = [];
    this.http.get<EventoExclusaoLogDTO[]>(this.url).subscribe({
      next: r => { this.logs = r; this.loading = false; },
      error: () => { this.error = 'Erro ao carregar histórico de exclusões.'; this.loading = false; }
    });
  }

  reset() {
    this.logs = [];
    this.loading = false;
    this.error = '';
  }

  close() {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.reset(), 300);
  }
}
