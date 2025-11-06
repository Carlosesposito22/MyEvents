import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-atividade',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './delete-atividade.html',
  styleUrls: ['../../app.css']
})
export class DeleteAtividade {
  @Output() fechar = new EventEmitter<void>();
  idAtividade: number | null = null;
  
  mensagemSucesso: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  removerAtividade(): void {
    this.error = '';
    this.mensagemSucesso = '';
    
    if (!this.idAtividade) {
      this.error = 'Informe o ID da atividade!';
      return;
    }

    this.loading = true;
    this.http.delete<any>(`http://localhost:8080/atividade/${this.idAtividade}`)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.mensagemSucesso = 'Atividade removida com sucesso!';

          setTimeout(() => {
            this.fechar.emit();
          }, 2000); 
        },
        error: (_: any) => {
          this.error = 'Erro ao remover atividade.';
          this.loading = false;
        }
      });
  }
}