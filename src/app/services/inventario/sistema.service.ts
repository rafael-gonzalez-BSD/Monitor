import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Sistema } from '../../models/inventario/sistema';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Opcion } from '../../models/base/opcion';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {
  constructor(private http: HttpClient) {}

  guardarSistema(sistema: Sistema, insercion: boolean): Observable<Sistema> {
    debugger

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
    m.Opcion = opcion;
    m.SistemaDescripcion = valor;
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
  consultarSistemaAll(Opcion: string, SistemaDescripcion: string, Baja?: string) {
    const parametros = new HttpParams().set('Opcion', Opcion).set('SistemaDescripcion', SistemaDescripcion);
    const url = `${environment.urlApi}sistema/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
