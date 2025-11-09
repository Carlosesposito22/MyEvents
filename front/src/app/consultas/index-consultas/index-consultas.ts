import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocaisNaoUtilizados } from "../locais-nao-utilizados/locais-nao-utilizados";
import { PalestrantesEspecialidades } from "../palestrantes-especialidades/palestrantes-especialidades";
import { EventosAcimaMedia } from "../eventos-acima-media/eventos-acima-media";

@Component({
  selector: 'app-index-consulta',
  standalone: true,
  imports: [
    CommonModule,
    LocaisNaoUtilizados,
    PalestrantesEspecialidades,
    EventosAcimaMedia
],
  templateUrl: './index-consultas.html',
  styleUrls: ['./index-consultas.css'] 
})
export class IndexConsultas {

  mostrarModalLocaisNaoUtilizados = false;
  mostrarModalPalestrantesEspecialidades = false;
  mostrarModalEventosAcimaMedia = false;
  mostrarModalAtividadesFiltradas = false;
  mostrarModalViewDetalhesEventos = false;
  mostrarModalViewGradeAtividades = false;

  constructor(private router: Router) {}

  voltarHome(): void {
    this.router.navigate(['/']);
  }

  abrirModalLocaisNaoUtilizados() { this.mostrarModalLocaisNaoUtilizados = true; }
  fecharModalLocaisNaoUtilizados() { this.mostrarModalLocaisNaoUtilizados = false; }

  abrirModalPalestrantesEspecialidades() { this.mostrarModalPalestrantesEspecialidades = true; }
  fecharModalPalestrantesEspecialidades() { this.mostrarModalPalestrantesEspecialidades = false; }

  abrirModalEventosAcimaMedia() { this.mostrarModalEventosAcimaMedia = true; }
  fecharModalEventosAcimaMedia() { this.mostrarModalEventosAcimaMedia = false; }

  abrirModalAtividadesFiltradas() { this.mostrarModalAtividadesFiltradas = true; }
  fecharModalAtividadesFiltradas() { this.mostrarModalAtividadesFiltradas = false; }

  abrirModalViewDetalhesEventos() { this.mostrarModalViewDetalhesEventos = true; }
  fecharModalViewDetalhesEventos() { this.mostrarModalViewDetalhesEventos = false; }

  abrirModalViewGradeAtividades() { this.mostrarModalViewGradeAtividades = true; }
  fecharModalViewGradeAtividades() { this.mostrarModalViewGradeAtividades = false; }
}