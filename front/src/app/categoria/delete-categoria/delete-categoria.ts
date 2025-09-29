import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './delete-categoria.html',
  styleUrls: ['../../app.css']
})
export class DeleteCategoria {
  @Output() fechar = new EventEmitter<void>();
  idCategoria: number | null = null;
  
  mensagemSucesso: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  removerCategoria(): void {
    this.error = '';
    this.mensagemSucesso = '';
    
    if (!this.idCategoria) {
      this.error = 'Informe o ID da categoria!';
      return;
    }

    this.loading = true;
    this.http.delete<any>(`http://localhost:8080/categoria/${this.idCategoria}`)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.mensagemSucesso = 'Categoria removida com sucesso!';

          setTimeout(() => {
            this.fechar.emit();
          }, 2000); 
        },
        error: (_: any) => {
          this.error = 'Erro ao remover categoria.';
          this.loading = false;
        }
      });
  }
}