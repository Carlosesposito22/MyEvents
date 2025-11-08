import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-palestrante',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './create-palestrante.html',
  styleUrls: ['../../app.css']
})
export class CreatePalestrante {
  @Output() fechar = new EventEmitter<void>();

  palestrante = {
    nome: null as string | null,
    email: null as string | null,
    biografia: null as string | null,
    linkedin: null as string | null,
    lattes: null as string | null,
  };

  resultado: any = null;
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  criarPalestrante(): void {
    this.error = '';
    this.resultado = null;
    this.loading = true;

    this.http.post<any>('http://localhost:8080/palestrante', this.palestrante)
      .subscribe({
        next: (res) => {
          this.resultado = res;
          this.loading = false;
        },
        error: (_) => {
          this.error = 'Erro ao criar palestrante. Verifique os campos (email, lattes e linkedin devem ser únicos).';
          this.loading = false;
        }
      });
  }
}