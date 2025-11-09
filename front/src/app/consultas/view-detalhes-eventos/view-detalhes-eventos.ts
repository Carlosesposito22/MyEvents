import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ViewDetalhesEventoDTO {
    id_evento: number;
    titulo: string;
    data_inicio: string;
    data_fim: string;
    numero_participantes: number;
    limite_participantes: number;
    carga_horaria: number;
    nomeCategoria: string;
    nomeLocal: string | null;
    cidade: string | null;
    estado: string | null;
    rua: string | null;
    numeroLocal: number | null;
    url_evento: string | null;
    aplicativoTrasmissao: string | null;
    qtd_atividades: number;
    qtd_palestrantes: number; 
}

@Component({
  selector: 'app-view-detalhes-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-detalhes-eventos.html',
  styleUrls: ['../../app.css']
})
export class ViewDetalhesEventos implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  private urlListar = 'http://localhost:8080/consultas/view/detalhes-eventos';
  private urlBuscar = 'http://localhost:8080/consultas/view/detalhes-eventos/';

  modo: 'lista' | 'busca' = 'lista';

  loadingLista = false;
  errorLista = '';
  eventos: ViewDetalhesEventoDTO[] = [];

  loadingBusca = false;
  errorBusca = '';
  idBusca: string = '';
  idBuscado: string = ''; 
  eventoEncontrado: ViewDetalhesEventoDTO | null = null;
  buscaRealizada = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.resetState();
      this.buscarListaEventos();
    }
  }

  setModo(modo: 'lista' | 'busca'): void {
    this.modo = modo;
    if (this.modo === 'lista' && this.eventos.length === 0 && !this.loadingLista) {
      this.buscarListaEventos();
    }
  }

  buscarListaEventos(): void {
    this.loadingLista = true;
    this.errorLista = '';
    this.http.get<ViewDetalhesEventoDTO[]>(this.urlListar).subscribe({
      next: (lista) => {
        this.eventos = lista;
        this.loadingLista = false;
      },
      error: (err) => {
        this.errorLista = 'Erro ao carregar a lista de eventos da view.';
        console.error(err);
        this.loadingLista = false;
      }
    });
  }

  buscarPorId(): void {
    if (!this.idBusca) {
      this.errorBusca = 'Por favor, digite um ID.';
      return;
    }

    this.loadingBusca = true;
    this.errorBusca = '';
    this.eventoEncontrado = null;
    this.buscaRealizada = true;
    this.idBuscado = this.idBusca;

    this.http.get<ViewDetalhesEventoDTO>(this.urlBuscar + this.idBusca).subscribe({
      next: (resultado) => {
        this.eventoEncontrado = resultado;
        this.loadingBusca = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.eventoEncontrado = null;
        } else {
          this.errorBusca = 'Erro ao buscar o evento.';
        }
        this.loadingBusca = false;
      }
    });
  }

  resetState(): void {
    this.modo = 'lista';
    this.eventos = [];
    this.loadingLista = false;
    this.errorLista = '';
    this.loadingBusca = false;
    this.errorBusca = '';
    this.idBusca = '';
    this.idBuscado = '';
    this.eventoEncontrado = null;
    this.buscaRealizada = false;
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
    setTimeout(() => this.resetState(), 300);
  }
}