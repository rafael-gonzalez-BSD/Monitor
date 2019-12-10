import { environment } from './../../../environments/environment.prod';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proceso } from '../../models/inventario/proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) {}

  obtenerFiltros(m: Proceso) {
    this.filtros.emit(m);
  }

  setearFiltros(m: Proceso) {
    this.setFiltros.emit(m);
  }

  guardarProceso(proceso: Proceso, esEdicion: boolean): Observable<Proceso> {
    const url = `${environment.urlApi}proceso`;
    if (esEdicion) {
      return this.http.put<Proceso>(url, proceso);
    } else {
      return this.http.post<Proceso>(url, proceso);
    }
  }

  actualizarEstado(proceso: Proceso) {
    const url = `${environment.urlApi}proceso/estado`;
    return this.http.patch<Proceso>(url, proceso);
  }

  actualizarCritico(proceso: Proceso) {
    const url = `${environment.urlApi}proceso/critico`;
    return this.http.patch<Proceso>(url, proceso);
  }

  consultarProcesoCombo(m: Proceso) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}proceso/combo`;
    return this.http.get(url, { params: parametros });
  }

  obtenerProcesos(m: Proceso) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}proceso/all`;
    return this.http.get(url, { params: parametros });
  }
}
