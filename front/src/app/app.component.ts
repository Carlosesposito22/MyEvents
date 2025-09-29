import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppEventoComponent } from './app-evento.component';
import { AppEventosPorCategoriaComponent } from './app-eventos-por-categoria.component';
import { AppEventosBuscarComponent } from './app-eventos-buscar.component';
import { AppEventosPorDataComponent } from './app-eventos-por-data.component';
import { AppEventoCriarComponent } from './app-evento-criar.component';
import { AppEventoEditarComponent } from './app-evento-editar.component';
import { AppEventoRemoverComponent } from './app-evento-remover.component';
import { CreateCategoria } from "./categoria/create-categoria/create-categoria";
import { FindCategoria } from "./categoria/find-categoria/find-categoria";
import { UpdateCategoria } from "./categoria/update-categoria/update-categoria";
import { DeleteCategoria } from "./categoria/delete-categoria/delete-categoria";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppEventoComponent,
    AppEventosPorCategoriaComponent,
    AppEventosBuscarComponent,
    AppEventosPorDataComponent,
    AppEventoCriarComponent,
    AppEventoEditarComponent,
    AppEventoRemoverComponent,
    CreateCategoria,
    FindCategoria,
    UpdateCategoria,
    DeleteCategoria
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

  mostrarModalCriarCategoria = false;
  mostrarModalBuscarCategoria = false;
  mostrarModalEditarCategoria = false;
  mostrarModalRemoverCategoria = false;

  abrirModal(): void {
    this.mostrarModal = true;
  }
  fecharModal(): void {
    this.mostrarModal = false;
  }
  abrirModalPorCategoria(): void {
    this.mostrarModalPorCategoria = true;
  }
  fecharModalPorCategoria(): void {
    this.mostrarModalPorCategoria = false;
  }
  abrirModalBuscarTitulo(): void {
    this.mostrarModalBuscarTitulo = true;
  }
  fecharModalBuscarTitulo(): void {
    this.mostrarModalBuscarTitulo = false;
  }
  abrirModalPorData(): void {
    this.mostrarModalPorData = true;
  }
  fecharModalPorData(): void {
    this.mostrarModalPorData = false;
  }
  abrirModalCriar(): void {
    this.mostrarModalCriar = true;
  }
  fecharModalCriar(): void {
    this.mostrarModalCriar = false;
  }
  abrirModalEditar(): void {
    this.mostrarModalEditar = true;
  }
  fecharModalEditar(): void {
    this.mostrarModalEditar = false;
  }
  abrirModalRemover(): void {
    this.mostrarModalRemover = true;
  }
  fecharModalRemover(): void {
    this.mostrarModalRemover = false;
  }
  //#####################################
  abrirModalCriarCategoria(): void {
    this.mostrarModalCriarCategoria = true;
  }
  fecharModalCriarCategoria(): void {
    this.mostrarModalCriarCategoria = false;
  }
  abrirModalBuscarCategoria(): void {
    this.mostrarModalBuscarCategoria = true;
  }
  fecharModalBuscarCategoria(): void {
    this.mostrarModalBuscarCategoria = false;
  }
  abrirModalEditarCategoria(): void {
    this.mostrarModalEditarCategoria = true;
  }
  fecharModalEditarCategoria(): void {
    this.mostrarModalEditarCategoria = false;
  }
  abrirModalRemoverCategoria(): void {
    this.mostrarModalRemoverCategoria = true;
  }
  fecharModalRemoverCategoria(): void {
    this.mostrarModalRemoverCategoria = false;
  }
}
