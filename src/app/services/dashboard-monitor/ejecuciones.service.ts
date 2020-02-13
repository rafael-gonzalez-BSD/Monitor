import { Injectable, EventEmitter } from '@angular/core';
import { FiltrosEjecucion } from 'src/app/models/dashboard-monitor/filtros-ejecucion';

@Injectable({
  providedIn: 'root'
})
export class EjecucionesService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();

  constructor() { }

  obtenerFiltros() {

    const m: FiltrosEjecucion = JSON.parse(localStorage.getItem('filtrosEjecucion'));
    this.filtros.emit(m);
  }

  setearFiltros() {    
    const m: FiltrosEjecucion = JSON.parse(localStorage.getItem('filtrosEjecucion'));
    this.setFiltros.emit(m);
  }
}
