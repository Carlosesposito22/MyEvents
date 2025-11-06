import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgIf, NgFor } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-atividades-por-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './atividades-por-evento.html',
  styleUrls: ['../../app.css']
})
export class AtividadesPorEvento {
  @Output() fechar = new EventEmitter<void>();

  id_evento: number | null = null;
  atividades: any[] | null = null; 
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscarAtividadesPorEvento(): void {
    this.error = '';
    this.atividades = null;

    if (this.id_evento == null || isNaN(this.id_evento)) {
      this.error = 'Digite um ID de evento válido.';
      return;
    }

    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/atividade/evento/${this.id_evento}`)
      .subscribe({
        next: (res: any[]) => {
          if (!res || res.length === 0) {
            this.atividades = null;
            this.error = 'Nenhuma atividade encontrada para este evento.';
          } else {
            this.atividades = res; 
            this.error = '';
          }
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao buscar atividades. Verifique o ID do evento.';
          this.loading = false;
        }
      });
  }
}