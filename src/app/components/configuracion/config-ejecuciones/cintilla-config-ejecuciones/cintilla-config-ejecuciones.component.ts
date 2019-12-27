import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cintilla-config-ejecuciones',
  templateUrl: './cintilla-config-ejecuciones.component.html',
  styleUrls: ['./cintilla-config-ejecuciones.component.scss']
})
export class CintillaConfigEjecucionesComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroProceso = 'N/A';
  constructor() { }

  ngOnInit() {
  }

}
