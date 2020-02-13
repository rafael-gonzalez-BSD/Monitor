import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cintilla-bitacora-ejecuciones',
  templateUrl: './cintilla-bitacora-ejecuciones.component.html',
  styleUrls: ['./cintilla-bitacora-ejecuciones.component.scss']
})
export class CintillaBitacoraEjecucionesComponent implements OnInit {
  filtroSistema = 'Todos';
  filtroProceso = 'Todos';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';

  constructor() { }

  ngOnInit() {
  }

}
