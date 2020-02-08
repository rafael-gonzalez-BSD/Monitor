import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FiltrosExcepcion } from 'src/app/models/dashboard-monitor/filtros-excepcion';
import { Excepcion } from 'src/app/models/dashboard-monitor/excepcion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionesService {

  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) {}

  obtenerFiltros() {

    const m: FiltrosExcepcion = JSON.parse(localStorage.getItem('filtrosExcepcion'));
    m.sistemaBaja = false;
    this.filtros.emit(m);
  }

  setearFiltros() {    
    const m = new FiltrosExcepcion();
    const filtrosExcepcion = JSON.parse(localStorage.getItem('filtrosExcepcion'));
    m.opcion = 4;
    m.excepcionId = filtrosExcepcion.excepcionId;
    m.excepcionEstatusId = filtrosExcepcion.excepcionEstatusId;
    m.fechaHasta = filtrosExcepcion.fechaHasta;
    m.excepcionEstatusDescripcion = filtrosExcepcion.excepcionEstatusDescripcion;

    m.sistemaId = filtrosExcepcion.sistemaId;
    m.sistemaDescripcion = filtrosExcepcion.sistemaDescripcion;
    m.fechaDesde = filtrosExcepcion.fechaDesde;
    m.fechaHasta = filtrosExcepcion.fechaHasta;
    this.setFiltros.emit(m);
  }

  consultarExcepciones(m: Excepcion) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}Excepcion/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
