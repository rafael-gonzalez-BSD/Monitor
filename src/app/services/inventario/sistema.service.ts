import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Sistema } from '../../models/inventario/sistema';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Respuesta } from '../../models/base/respuesta';
import { debug } from 'util';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor( private http: HttpClient ) { }

  guardarSistema(sistema: Sistema): Observable<Sistema> {
    // tslint:disable-next-line: no-debugger
    debugger;
    const url = `${environment.urlApi}sistema`;
    console.log(sistema);
    console.log(url);
    
    return this.http.post<Sistema>(url, sistema);
  }
}
