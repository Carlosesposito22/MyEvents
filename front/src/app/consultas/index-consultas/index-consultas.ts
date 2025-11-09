import { Component } from '@angular/core';

@Component({
  selector: 'app-index-consultas',
  imports: [],
  templateUrl: './index-consultas.html',
  styleUrl: './index-consultas.css'
})
export class IndexConsultas {
  
  voltarHome() {
    window.location.href = 'http://localhost:4200/';
  }
}
