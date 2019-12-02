import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Sistema } from '../../models/inventario/sistema';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor( private http: HttpClient ) { }

  guardarSistema(sistema: Sistema): Observable<Sistema> {
    const url = `${environment.urlApi}sistema`;
    return this.http.post<Sistema>(url, sistema);
  }
}
