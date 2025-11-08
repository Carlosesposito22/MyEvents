import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-get-palestrante',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './get-palestrante.html',
  styleUrls: ['../../app.css']
})
export class GetPalestrante {
  @Output() fechar = new EventEmitter<void>();

  palestranteId: number | null = null;
  palestrante: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  buscarPalestrante(): void {
    this.error = '';
    this.palestrante = null;

    if (this.palestranteId == null || isNaN(this.palestranteId)) {
      this.error = 'Digite um ID válido.';
      return;
    }

    this.loading = true;
    this.http.get<any>(`http://localhost:8080/palestrante/${this.palestranteId}`)
      .subscribe({
        next: (res: any) => {
          this.palestrante = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Palestrante não encontrado.'; 
          this.loading = false;
        }
      });
  }
}