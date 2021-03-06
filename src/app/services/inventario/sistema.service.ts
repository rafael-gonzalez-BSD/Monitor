import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Sistema } from '../../models/inventario/sistema';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();

  constructor(private http: HttpClient) { }

  guardarSistema(sistema: Sistema, insercion: boolean): Observable<Sistema> {
    let resultado: any;
    if (insercion) {
      const url = `${environment.urlApi}sistema`;
      resultado = this.http.post<Sistema>(url, sistema);
    } else {
      const url = `${environment.urlApi}sistema`;
      resultado = this.http.put<Sistema>(url, sistema);
    }
    return resultado;
  }

  buscarSistemaCombo(valor: string, opcion: number): Observable<Sistema> {
    const m = new Sistema();
    m.opcion = opcion;
    m.sistemaDescripcion = valor;
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}sistema/combo`;
    return this.http.get<Sistema>(url, { params: parametros });
  }

  consultarSistemaCombo(m: Sistema) {

    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}sistema/combo`;
    return this.http.get(url, { params: parametros });
  }
  // tslint:disable-next-line: no-shadowed-variable
  consultarSistemaAll(m: Sistema) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}sistema/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }

  obtenerFiltros() {
    const m: Sistema = JSON.parse(localStorage.getItem('filtrosSistemas'));
    this.filtros.emit(m);
  }

  setearFiltros() {
    const m: Sistema = JSON.parse(localStorage.getItem('filtrosSistemas'));
    this.setFiltros.emit(m);
  }

  actualizarEstado(sistema: Sistema) {
    const url = `${environment.urlApi}sistema`;
    return this.http.patch<Sistema>(url, sistema);
  }
}
