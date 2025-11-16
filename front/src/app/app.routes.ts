import { Routes } from '@angular/router';
import { GraficosComponent } from './grafico/graficos.component'; // ajuste o caminho se necessário!
import { IndexConsultas } from './consultas/index-consultas/index-consultas';
import { AppComponent } from './app.component';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: 'graficos', component: GraficosComponent },
  { path: 'consultas', component: IndexConsultas },
  { path: 'dashboard', component: Dashboard }
];
