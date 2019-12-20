import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigExcepciones } from '../../models/configuracion/config-excepciones';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigExcepcionesService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) { }

  obtenerFiltros() {
    const m: ConfigExcepciones = JSON.parse(localStorage.getItem('filtrosConfigExcepciones'));
    this.filtros.emit(m);
  }

  setearFiltros() {
    const m: ConfigExcepciones = JSON.parse(localStorage.getItem('filtrosConfigExcepciones'));
    this.setFiltros.emit(m);
  }

  guardarConfigExcepcion(configExcepciones: ConfigExcepciones, esEdicion: boolean): Observable<ConfigExcepciones> {
    const url = `${environment.urlApi}excepcionConfiguracion`;
    if (esEdicion) {
      return this.http.put<ConfigExcepciones>(url, configExcepciones);
    }
    return this.http.post<ConfigExcepciones>(url, configExcepciones);
  }

  actualizarEstado(proceso: ConfigExcepciones) {
    const url = `${environment.urlApi}excepcionConfiguracion`;
    return this.http.patch<ConfigExcepciones>(url, proceso);
  }

  obtenerConfigExcepciones(m: ConfigExcepciones) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}excepcionConfiguracion/all`;
    return this.http.get(url, { params: parametros });
  }
}
