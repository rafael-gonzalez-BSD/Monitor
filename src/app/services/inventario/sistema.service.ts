import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Sistema } from '../../models/inventario/sistema';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Opcion } from '../../models/base/opcion';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor(private http: HttpClient) { }

  guardarSistema(sistema: Sistema, insercion: boolean): Observable<Sistema> {
    console.log(sistema);
    debugger;
    
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

  consultarSistemaCombo() {
    const parametros = new HttpParams().set('Opcion', '3').set('Baja', 'false');
    const url = `${environment.urlApi}sistema/combo`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
  // tslint:disable-next-line: no-shadowed-variable
  consultarSistemaAll(Opcion: string, SistemaDescripcion: string, Baja?: string) {
    const parametros = new HttpParams().set('Opcion', Opcion)
      .set('SistemaDescripcion', SistemaDescripcion);
    const url = `${environment.urlApi}sistema/all`;
    const resultado = this.http.get(url, { params: parametros });
    return resultado;
  }
}
