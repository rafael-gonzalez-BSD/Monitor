import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Respuesta } from '../../models/base/respuesta';
import { Proceso } from '../../models/inventario/proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  constructor(private http: HttpClient) { }

  insertar(m: Proceso): Observable<Respuesta> {
    const url = `${environment.urlApi}proceso`;
    return this.http.post<Respuesta>(url, m);
  }

  obtenerProcesos() {
    const url = `${environment.urlApi}proceso`;
    return this.http.get(url);
  }
}
