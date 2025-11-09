import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface LocalNaoUtilizadoDTO {
  id_local: number;
  nomeLocal: string;
  cidade: string;
  capacidade: number;
}

@Component({
  selector: 'app-locais-nao-utilizados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locais-nao-utilizados.html',
  styleUrls: ['../../app.css']
})
export class LocaisNaoUtilizados implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  locais: LocalNaoUtilizadoDTO[] = [];
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.buscarLocais();
    }
  }

  buscarLocais(): void {
    this.loading = true;
    this.error = '';
    this.locais = [];

    this.http.get<LocalNaoUtilizadoDTO[]>('http://localhost:8080/consultas/locais-nao-utilizados')
    .subscribe({
      next: (lista) => {
        this.locais = lista;
        this.loading = false;
      },
      error: (e) => {
        this.error = 'Erro ao carregar os locais não utilizados.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
  }
}