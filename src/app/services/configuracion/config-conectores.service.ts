import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigConectoresService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) { }

  obtenerFiltros() {
    const m: ConfigConectores = JSON.parse(localStorage.getItem('filtrosConfigConectores'));
    this.filtros.emit(m);
  }

  setearFiltros() {
    const m: ConfigConectores = JSON.parse(localStorage.getItem('filtrosConfigConectores'));
    this.setFiltros.emit(m);
  }

  guardarConfigConector(configConectores: ConfigConectores, esEdicion: boolean): Observable<ConfigConectores> {
    const url = `${environment.urlApi}conectorConfiguracion`;
    if (esEdicion) {
      return this.http.put<ConfigConectores>(url, configConectores);
    }
    return this.http.post<ConfigConectores>(url, configConectores);
  }

  actualizarEstado(proceso: ConfigConectores) {
    const url = `${environment.urlApi}conectorConfiguracion`;
    return this.http.patch<ConfigConectores>(url, proceso);
  }

  consultarConectorCombo(m: ConfigConectores) {

    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}conectorConfiguracion/combo`;
    return this.http.get(url, { params: parametros });
  }

  obtenerConfigConectores(m: ConfigConectores) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}conectorConfiguracion/all`;
    return this.http.get(url, { params: parametros });
  }
}
