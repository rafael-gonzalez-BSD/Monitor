import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FiltrosExcepcionDetalle } from 'src/app/models/dashboard-monitor/filtros-excepcion-detalle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionDetalleService {
  constructor(private http: HttpClient) {}  

  

  consultarExcepcionDetalles(m: FiltrosExcepcionDetalle) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}ExcepcionDetalle/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
