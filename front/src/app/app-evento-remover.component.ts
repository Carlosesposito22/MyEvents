import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evento-remover',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './app-evento-remover.component.html'
})
export class AppEventoRemoverComponent {
  @Output() fechar = new EventEmitter<void>();
  idEvento: number | null = null;
  
  mensagemSucesso: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  removerEvento(): void {
    this.error = '';
    this.mensagemSucesso = '';
    
    if (!this.idEvento) {
      this.error = 'Informe o ID do evento!';
      return;
    }

    this.loading = true;
    this.http.delete<any>(`http://localhost:8080/evento/${this.idEvento}`)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.mensagemSucesso = 'Evento removido com sucesso!';

          setTimeout(() => {
            this.fechar.emit();
          }, 3000); 
        },
        error: (_: any) => {
          this.error = 'Erro ao remover evento.';
          this.loading = false;
        }
      });
  }
}