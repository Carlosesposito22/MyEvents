import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AppEventoComponent } from './evento/evento-get/app-evento.component';
import { AppEventosPorCategoriaComponent } from './evento/eventos-por-categoria/app-eventos-por-categoria.component';
import { AppEventosBuscarComponent } from './evento/eventos-buscar/app-eventos-buscar.component';
import { AppEventosPorDataComponent } from './evento/eventos-por-data/app-eventos-por-data.component';
import { AppEventoCriarComponent } from './evento/evento-criar/app-evento-criar.component';
import { AppEventoEditarComponent } from './evento/evento-editar/app-evento-editar.component';
import { AppEventoRemoverComponent } from './evento/evento-remover/app-evento-remover.component';
import { CreateCategoria } from "./categoria/create-categoria/create-categoria";
import { FindCategoria } from "./categoria/find-categoria/find-categoria";
import { UpdateCategoria } from "./categoria/update-categoria/update-categoria";
import { DeleteCategoria } from "./categoria/delete-categoria/delete-categoria";
import { BuscarCategoria } from "./categoria/buscar-categoria/buscar-categoria";
import { BuscarSubcategoriasComponent } from "./categoria/buscar-subcategorias/buscar-subcategorias";
import { HierarquiaCategorias } from "./categoria/hierarquia-categorias/hierarquia-categorias";
import { CreateAtividade } from "./atividade/create-atividade/create-atividade";
import { BuscarAtividade } from "./atividade/buscar-atividade/buscar-atividade";
import { GetAtividade } from "./atividade/get-atividade/get-atividade";
import { UpdateAtividade } from "./atividade/update-atividade/update-atividade";
import { DeleteAtividade } from "./atividade/delete-atividade/delete-atividade";
import { AtividadesPorEvento } from "./atividade/atividades-por-evento/atividades-por-evento";
import { GetPalestrante } from "./palestrante/get-palestrante/get-palestrante";
import { BuscarPalestrante } from "./palestrante/buscar-palestrante/buscar-palestrante";
import { CreatePalestrante } from "./palestrante/create-palestrante/create-palestrante";
import { UpdatePalestrante } from "./palestrante/update-palestrante/update-palestrante";
import { DeletePalestrante } from "./palestrante/delete-palestrante/delete-palestrante";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
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
    DeleteCategoria,
    BuscarCategoria,
    BuscarSubcategoriasComponent,
    HierarquiaCategorias,
    CreateAtividade,
    BuscarAtividade,
    GetAtividade,
    UpdateAtividade,
    DeleteAtividade,
    AtividadesPorEvento,
    GetPalestrante,
    BuscarPalestrante,
    CreatePalestrante,
    UpdatePalestrante,
    DeletePalestrante
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
  mostrarModalBuscarNomeCategoria = false;

  mostrarModalCriarCategoria = false;
  mostrarModalBuscarCategoria = false;
  mostrarModalEditarCategoria = false;
  mostrarModalRemoverCategoria = false;
  mostrarModalSubcategoriasAberto = false;
  mostrarModalCategoriaHierarquia = false;

  mostrarModalCriarAtividade = false;
  mostrarModalBuscarAtividadeTitulo = false;
  mostrarModalBuscarAtividade = false;
  mostrarModalEditarAtividade = false;
  mostrarModalRemoverAtividade = false;
  mostrarModalListarAtividadesEvento = false;

  mostrarModalBuscarPalestrante = false;
  mostrarModalBuscarPalestranteNome = false;
  mostrarModalCriarPalestrante = false;
  mostrarModalEditarPalestrante = false;
  mostrarModalRemoverPalestrante = false;

  constructor(public router: Router) {}

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
  // Categoria -------------------------------#
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
  abrirModalBuscarNomeCategoria(): void {
    this.mostrarModalBuscarNomeCategoria = true;
  }
  fecharModalBuscarNomeCategoria(): void {
    this.mostrarModalBuscarNomeCategoria = false;
  }
  abrirModalSubCategorias(): void {
    this.mostrarModalSubcategoriasAberto = true;
  }
  fecharModalSubCategorias(): void {
    this.mostrarModalSubcategoriasAberto = false;
  }
  abrirModalCategoriaHierarquia(): void {
    this.mostrarModalCategoriaHierarquia = true;
  }
  fecharModalCategoriaHierarquia(): void {
    this.mostrarModalCategoriaHierarquia = false;
  }
  // Atividade -------------------------------#
  abrirModalCriarAtividade(): void {
    this.mostrarModalCriarAtividade = true;
  }
  fecharModalCriarAtividade(): void {
    this.mostrarModalCriarAtividade = false;
  }
  abrirModalBuscarAtividadePorTitulo(): void {
    this.mostrarModalBuscarAtividadeTitulo = true;
  }
  fecharModalBuscarAtividadePorTitulo(): void {
    this.mostrarModalBuscarAtividadeTitulo = false;
  }
  abrirModalBuscarAtividade(): void {
    this.mostrarModalBuscarAtividade = true;
  }
  fecharModalBuscarAtividade(): void {
    this.mostrarModalBuscarAtividade = false;
  }
  abrirModalEditarAtividade(): void {
    this.mostrarModalEditarAtividade= true;
  }
  fecharModalEditarAtividade(): void {
    this.mostrarModalEditarAtividade = false;
  }
  abrirModalRemoverAtividade(): void {
    this.mostrarModalRemoverAtividade = true;
  }
  fecharModalRemoverAtividade(): void {
    this.mostrarModalRemoverAtividade = false;
  }
  abrirModalListarAtividadesEvento(): void {
    this.mostrarModalListarAtividadesEvento = true;
  }
  fecharModalListarAtividadesEvento(): void {
    this.mostrarModalListarAtividadesEvento = false;
  }
  // Palestrante -------------------------------#
  abrirModalBuscarPalestrante(): void {
    this.mostrarModalBuscarPalestrante = true;
  }
  fecharModalBuscarPalestrante(): void {
    this.mostrarModalBuscarPalestrante = false;
  }
  abrirModalBuscarPalestrantePorNome(): void {
    this.mostrarModalBuscarPalestranteNome = true;
  }
  fecharModalBuscarPalestrantePorNome(): void {
    this.mostrarModalBuscarPalestranteNome = false;
  }
  abrirModalCriarPalestrante(): void {
    this.mostrarModalCriarPalestrante = true;
  }
  fecharModalCriarPalestrante(): void {
    this.mostrarModalCriarPalestrante = false;
  }
  abrirModalEditarPalestrante(): void {
    this.mostrarModalEditarPalestrante = true;
  }
  fecharModalEditarPalestrante(): void {
    this.mostrarModalEditarPalestrante = false;
  }
  abrirModalRemoverPalestrante(): void {
    this.mostrarModalRemoverPalestrante = true;
  }
  fecharModalRemoverPalestrante(): void {
    this.mostrarModalRemoverPalestrante = false;
  }
}
