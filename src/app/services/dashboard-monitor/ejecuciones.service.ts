import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EjecucionesService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();

  constructor() { }

  // obtenerFiltros() {

  //   const m: FiltrosEjecucion = JSON.parse(localStorage.getItem('filtrosExcepcion'));
  //   m.sistemaBaja = false;
  //   this.filtros.emit(m);
  // }

  // setearFiltros() {    
  //   const m = new FiltrosEjecucion();
  //   const filtrosExcepcion = JSON.parse(localStorage.getItem('filtrosExcepcion'));
  //   m.opcion = 4;
  //   m.excepcionId = filtrosExcepcion.excepcionId;
  //   m.excepcionEstatusId = filtrosExcepcion.excepcionEstatusId;
  //   m.fechaHasta = filtrosExcepcion.fechaHasta;
  //   m.excepcionEstatusDescripcion = filtrosExcepcion.excepcionEstatusDescripcion;

  //   m.sistemaId = filtrosExcepcion.sistemaId;
  //   m.sistemaDescripcion = filtrosExcepcion.sistemaDescripcion;
  //   m.fechaDesde = filtrosExcepcion.fechaDesde;
  //   m.fechaHasta = filtrosExcepcion.fechaHasta;
  //   this.setFiltros.emit(m);
  // }
}
