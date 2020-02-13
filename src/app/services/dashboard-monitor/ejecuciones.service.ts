import { Injectable, EventEmitter } from '@angular/core';
import { FiltrosEjecucion } from 'src/app/models/dashboard-monitor/filtros-ejecucion';
import { Excepcion } from 'src/app/models/dashboard-monitor/excepcion';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Ejecucion } from 'src/app/models/dashboard-monitor/ejecucion';

@Injectable({
  providedIn: 'root'
})
export class EjecucionesService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();

  constructor(private http: HttpClient) { }

  obtenerFiltros() {

    const m: FiltrosEjecucion = JSON.parse(localStorage.getItem('filtrosEjecucion'));
    this.filtros.emit(m);
  }

  setearFiltros() {    
    const m: FiltrosEjecucion = JSON.parse(localStorage.getItem('filtrosEjecucion'));
    this.setFiltros.emit(m);
  }

  consultarEjecuciones(m: Ejecucion) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}Ejecucion/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
