import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExcepcionEstatus } from 'src/app/models/dashboard-monitor/excepcion-estatus';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionEstatusService {

  constructor( private http: HttpClient) { }

  consultarExcepcionEstatusCombo(m: ExcepcionEstatus) {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}ExcepcionEstatus/combo`;
    return this.http.get(url, { params: parametros });
  }
}
