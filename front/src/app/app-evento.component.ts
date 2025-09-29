import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './app-evento.component.html',
  styleUrls: ['./app.css']
})
export class AppEventoComponent {
  @Output() fechar = new EventEmitter<void>();

  eventoId: number | null = null;
  evento: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscarEvento(): void {
    this.error = '';
    this.evento = null;

    if (this.eventoId == null || isNaN(this.eventoId)) {
      this.error = 'Digite um ID válido.';
      return;
    }

    this.loading = true;
    this.http.get<any>(`http://localhost:8080/evento/${this.eventoId}`)
      .subscribe({
        next: (res: any) => {
          this.evento = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Evento não encontrado.';
          this.loading = false;
        }
      });
  }
}
