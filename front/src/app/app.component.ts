import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Seus componentes existentes:
import { AppEventoComponent } from './app-evento.component';
import { AppEventosPorCategoriaComponent } from './app-eventos-por-categoria.component';
import { AppEventosBuscarComponent } from './app-eventos-buscar.component';
import { AppEventosPorDataComponent } from './app-eventos-por-data.component';
import { AppEventoCriarComponent } from './app-evento-criar.component';
import { AppEventoEditarComponent } from './app-evento-editar.component';
import { AppEventoRemoverComponent } from './app-evento-remover.component';
// IMPORTS NECESSÁRIOS PARA O ROUTER:
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Router imports:
    RouterOutlet,
    RouterLink,
    // Seus componentes:
    AppEventoComponent,
    AppEventosPorCategoriaComponent,
    AppEventosBuscarComponent,
    AppEventosPorDataComponent,
    AppEventoCriarComponent,
    AppEventoEditarComponent,
    AppEventoRemoverComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  mostrarModal = false;
  mostrarModalPorCategoria = false;
  mostrarModalBuscarTitulo = false;
  mostrarModalPorData = false;
  mostrarModalCriar = false;
  mostrarModalEditar = false;
  mostrarModalRemover = false;

  // INJEÇÃO DO ROUTER NO CONSTRUTOR
  constructor(public router: Router) {}

  abrirModal(): void { this.mostrarModal = true; }
  fecharModal(): void { this.mostrarModal = false; }
  abrirModalPorCategoria(): void { this.mostrarModalPorCategoria = true; }
  fecharModalPorCategoria(): void { this.mostrarModalPorCategoria = false; }
  abrirModalBuscarTitulo(): void { this.mostrarModalBuscarTitulo = true; }
  fecharModalBuscarTitulo(): void { this.mostrarModalBuscarTitulo = false; }
  abrirModalPorData(): void { this.mostrarModalPorData = true; }
  fecharModalPorData(): void { this.mostrarModalPorData = false; }
  abrirModalCriar(): void { this.mostrarModalCriar = true; }
  fecharModalCriar(): void { this.mostrarModalCriar = false; }
  abrirModalEditar(): void { this.mostrarModalEditar = true; }
  fecharModalEditar(): void { this.mostrarModalEditar = false; }
  abrirModalRemover(): void { this.mostrarModalRemover = true; }
  fecharModalRemover(): void { this.mostrarModalRemover = false; }
}
