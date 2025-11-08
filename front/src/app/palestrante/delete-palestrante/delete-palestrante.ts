import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-palestrante',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './delete-palestrante.html',
  styleUrls: ['../../app.css']
})
export class DeletePalestrante {
  @Output() fechar = new EventEmitter<void>();
  idPalestrante: number | null = null;
  
  mensagemSucesso: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  removerPalestrante(): void {
    this.error = '';
    this.mensagemSucesso = '';
    
    if (!this.idPalestrante) {
      this.error = 'Informe o ID do palestrante!';
      return;
    }

    this.loading = true;
    this.http.delete<any>(`http://localhost:8080/palestrante/${this.idPalestrante}`)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.mensagemSucesso = 'Palestrante removido com sucesso!';

          setTimeout(() => {
            this.fechar.emit();
          }, 2000); 
        },
        error: (_: any) => {
          this.error = 'Erro ao remover palestrante.';
          this.loading = false;
        }
      });
  }
}