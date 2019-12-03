import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaModel } from '../../models/base/respuesta';
import { Proceso } from '../../models/inventario/proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  constructor(private http: HttpClient) {}

  guardarProceso(proceso: Proceso): Observable<Proceso> {
    const url = `${environment.urlApi}proceso`;
    return this.http.post<Proceso>(url, proceso);
  }

  obtenerProcesos(m: Proceso) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key].toString());
    }

    const url = `${environment.urlApi}proceso/all`;
    return this.http.get(url, { params: parametros });
  }
}
