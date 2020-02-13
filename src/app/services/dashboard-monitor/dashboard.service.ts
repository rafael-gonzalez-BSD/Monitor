import { Injectable, EventEmitter } from '@angular/core';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import moment from 'moment';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { yyyymmddToddmmyyyy } from 'src/app/extensions/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  filtros = new EventEmitter();
  filterevent = new EventEmitter();

  constructor(private http: HttpClient) { }

  setearFiltros() {
    
    const m: FiltrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    localStorage.setItem('sistemaIdBitacoras', m.sistemaId.toString());
    localStorage.setItem('sistemaDescripcionBitacoras', m.sistemaDescripcion);
    localStorage.setItem('fechaDesdeBitacoras', m.fechaDesde );
    localStorage.setItem('fechaHastaBitacoras', m.fechaHasta );
    this.filterevent.emit(m);

  }

  obtenerFiltros() {
    const m: FiltrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    this.filtros.emit(m);
  }

  consultarGraficoExcepciones(m: FiltrosDashboard){
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}Excepcion/grafico`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }

  consultarGraficoEjecuciones(m: FiltrosDashboard){
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}Ejecucion/grafico`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }

  consultarGraficoConectores(m: FiltrosDashboard){
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}Conector/grafico`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
