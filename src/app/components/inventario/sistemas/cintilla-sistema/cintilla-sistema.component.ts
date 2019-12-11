import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cintilla-sistema',
  templateUrl: './cintilla-sistema.component.html',
  styleUrls: ['./cintilla-sistema.component.scss']
})
export class CintillaSistemaComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroEstado = 'N/A';

  constructor() { }

  ngOnInit() {
  }

}
