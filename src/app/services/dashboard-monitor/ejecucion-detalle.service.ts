import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FiltrosEjecucionDetalle } from 'src/app/models/dashboard-monitor/filtros-ejecucion-detalle';

@Injectable({
  providedIn: 'root'
})
export class EjecucionDetalleService {

  constructor(
    private http: HttpClient
  ) { }

  consultarExcepcionDetalles(m: FiltrosEjecucionDetalle) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}EjecucionDetalle/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
