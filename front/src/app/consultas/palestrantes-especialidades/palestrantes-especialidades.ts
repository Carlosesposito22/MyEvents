import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface PalestranteEspecialidadeDTO {
  nomePalestrante: string | null;
  nomeEspecialidade: string | null;
}

interface Combinado {
  palestrante: string;
  especialidade: string;
}

@Component({
  selector: 'app-palestrantes-especialidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './palestrantes-especialidades.html',
  styleUrls: ['../../app.css']
})
export class PalestrantesEspecialidades implements OnChanges {
  @Input() open = false;
  @Output() fechar = new EventEmitter<void>();

  loading = false;
  error = '';

  combinados: Combinado[] = [];
  palestrantesOciosos: string[] = [];
  especialidadesOciosas: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.buscarDados();
    }
  }

  buscarDados(): void {
    this.loading = true;
    this.error = '';
    this.combinados = [];
    this.palestrantesOciosos = [];
    this.especialidadesOciosas = [];

    this.http.get<PalestranteEspecialidadeDTO[]>('http://localhost:8080/consultas/palestrantes-especialidades')
    .subscribe({
      next: (lista) => {
        this.processarLista(lista);
        this.loading = false;
      },
      error: (e) => {
        this.error = 'Erro ao carregar os dados de palestrantes.';
        this.loading = false;
      }
    });
  }

  private processarLista(lista: PalestranteEspecialidadeDTO[]): void {
    const combinadosSet = new Set<string>();
    const pOciososSet = new Set<string>();
    const eOciosasSet = new Set<string>();

    const combinados: Combinado[] = [];
    
    for (const item of lista) {
      if (item.nomePalestrante && item.nomeEspecialidade) {
        const chave = `${item.nomePalestrante}|${item.nomeEspecialidade}`;
        if (!combinadosSet.has(chave)) {
          combinadosSet.add(chave);
          combinados.push({ 
            palestrante: item.nomePalestrante, 
            especialidade: item.nomeEspecialidade 
          });
        }
      }
      else if (item.nomePalestrante && !item.nomeEspecialidade) {
        if (!pOciososSet.has(item.nomePalestrante)) {
          pOciososSet.add(item.nomePalestrante);
        }
      }
      else if (!item.nomePalestrante && item.nomeEspecialidade) {
        if (!eOciosasSet.has(item.nomeEspecialidade)) {
          eOciosasSet.add(item.nomeEspecialidade);
        }
      }
    }
    
    this.combinados = combinados.sort((a,b) => a.palestrante.localeCompare(b.palestrante));
    this.palestrantesOciosos = Array.from(pOciososSet).sort();
    this.especialidadesOciosas = Array.from(eOciosasSet).sort();
  }

  isEmpty(): boolean {
    return this.combinados.length === 0 && 
           this.palestrantesOciosos.length === 0 && 
           this.especialidadesOciosas.length === 0;
  }

  close(): void {
    this.open = false;
    this.fechar.emit();
  }
}