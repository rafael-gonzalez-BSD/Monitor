import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FiltrosConectorDetalle } from 'src/app/models/dashboard-monitor/filtros-conector-detalle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConectorDetalleService {

  constructor(
    private http: HttpClient
  ) { }

  consultarConectorDetalles(m: FiltrosConectorDetalle) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}ConectorDetalle/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
