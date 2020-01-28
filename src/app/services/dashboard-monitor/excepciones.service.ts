import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FiltrosExcepcion } from 'src/app/models/dashboard-monitor/filtros-excepcion';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionesService {

  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) {}

  obtenerFiltros() {
    m: FiltrosExcepcion;
    const filtrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    // this.filtros.emit(m);
  }

  setearFiltros() {
    
    const m = new FiltrosExcepcion();
    // const filtrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    const filtrosExcepcion = JSON.parse(localStorage.getItem('filtrosExcepcion'));
    m.excepcionId = filtrosExcepcion.excepcionId;
    m.excepcionEstatusId = filtrosExcepcion.excepcionEstatusId;
    m.fechaHasta = filtrosExcepcion.fechaHasta;
    // tslint:disable-next-line: radix
    m.sistemaId = parseInt( localStorage.getItem('sistemaIdBitacoras'));
    m.fechaDesde = localStorage.getItem('fechaDesdeBitacoras');
    m.fechaHasta = localStorage.getItem('fechaHastaBitacoras');
    m.excepcionEstatusDescripcion = filtrosExcepcion.excepcionEstatusDescripcion;
    m.sistemaDescripcion =  localStorage.getItem('sistemaDescripcionBitacoras');
    this.setFiltros.emit(m);
  }
}
