import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ADICIONE ESSA LINHA

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [CommonModule], // <-- ADICIONE ESSA LINHA
  templateUrl: './graficos.component.html',
})
export class GraficosComponent {
  // ...restante igual ao enviado anteriormente...
  graficos = [
    // 1
    {
      src: 'assets/grafico1LM2000.png',
      titulo: 'Inscritos X Capacidade do Evento'
    },
    // 2
    {
      src: 'assets/grafico2LM2000.png',
      titulo: 'Presenças X Capacidade do Evento'
    },
    // 3
    {
      src: 'assets/grafico3LM2000.png',
      titulo: 'Inscritos X Duração (horas) do Evento'
    },
    // 4
    {
      src: 'assets/grafico4LM2000.png',
      titulo: 'Presenças X Duração (horas) do Evento'
    },
    // 5
    {
      src: 'assets/grafico5LM2000.png',
      titulo: 'Presenças X Número de Palestrantes'
    },
    // 6 (Histograma duracao_horas)
    {
      src: 'assets/grafico6.png',
      titulo: 'Distribuição de Eventos X Duração'
    },
    // 7 (Histograma capacidade)
    {
      src: 'assets/grafico7LM2000.png',
      titulo: 'Distribuição de Capacidade dos Eventos'
    },
    // 8 (Barras categoria)
    {
      src: 'assets/grafico8.png',
      titulo: 'Eventos X Categoria'
    },
    // 9 (Barras Top 10 por presença)
    {
      src: 'assets/grafico9.png',
      titulo: 'Top 10 Eventos com Maior Público Presente'
    },
    // 10 (Barras Top 10 por taxa de ocupação)
    {
      src: 'assets/grafico10.png',
      titulo: 'Top 10 Eventos X Taxa de Ocupação (%)'
    },
    // 11 (Pizza categoria)
    {
      src: 'assets/grafico11.png',
      titulo: 'Proporção de Eventos X Categoria'
    },
    // 12 (Pizza superlotação)
    {
      src: 'assets/grafico12.png',
      titulo: 'Relação Entre o Porte dos Eventos'
    },
    // 13 (Pizza alta presença)
    {
      src: 'assets/grafico13.png',
      titulo: 'Relação de Duração dos Eventos'
    },
    // 14 (Boxplot distribuição por categoria)
    {
      src: 'assets/grafico14LM2000.png',
      titulo: 'Presenças X Capacidade'
    }
  ];

  modalAberto = false;
  graficoModal: { src: string, titulo: string } | null = null;

  abrirModal(grafico: { src: string, titulo: string }) {
    this.graficoModal = grafico;
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.graficoModal = null;
  }

  voltarHome() {
    window.location.href = 'http://localhost:4200/';
  }
}
