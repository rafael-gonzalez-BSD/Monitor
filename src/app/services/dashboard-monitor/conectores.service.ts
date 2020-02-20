import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FiltrosConector } from 'src/app/models/dashboard-monitor/filtros-conector';
import { Conector } from 'src/app/models/dashboard-monitor/conector';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConectoresService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();

  constructor(
    private http: HttpClient
  ) { }

  obtenerFiltros() {
    const m: FiltrosConector = JSON.parse(localStorage.getItem('filtrosConector'));
    this.filtros.emit(m);
  }

  setearFiltros() {    
    const m: FiltrosConector = JSON.parse(localStorage.getItem('filtrosConector'));
    this.setFiltros.emit(m);
  }

  consultarConectores(m: FiltrosConector) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}Conector/all`;
    const resultado = this.http.get(url, { params: parametros });  
    return resultado;
  }
}
