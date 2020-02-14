import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigEjecuciones } from 'src/app/models/configuracion/config-ejecuciones';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigEjecucionesService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) { }

  obtenerFiltros() {
    const m: ConfigEjecuciones = JSON.parse(localStorage.getItem('filtrosConfigEjecuciones'));
    this.filtros.emit(m);
  }

  setearFiltros() {
    const m: ConfigEjecuciones = JSON.parse(localStorage.getItem('filtrosConfigEjecuciones'));
    this.setFiltros.emit(m);
  }

  guardarConfigEjecucion(configEjecuciones: ConfigEjecuciones, esEdicion: boolean): Observable<ConfigEjecuciones> {
    const url = `${environment.urlApi}ejecucionConfiguracion`;
    if (esEdicion) {
      return this.http.put<ConfigEjecuciones>(url, configEjecuciones);
    }
    return this.http.post<ConfigEjecuciones>(url, configEjecuciones);
  }

  actualizarEstado(proceso: ConfigEjecuciones) {
    const url = `${environment.urlApi}ejecucionConfiguracion`;
    return this.http.patch<ConfigEjecuciones>(url, proceso);
  }

  obtenerConfigEjecuciones(m: ConfigEjecuciones) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}ejecucionConfiguracion/all`;
    return this.http.get(url, { params: parametros });
  }

  obtenerConfigEjecucionesId(m: ConfigEjecuciones) {
    
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}ejecucionConfiguracion/by`;
    return this.http.get(url, { params: parametros });
  }
}
