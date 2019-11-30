import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  constructor() { }

  // guardarSistema(register: Usuario): Observable<Usuario> {
  //   const url = `${environment.urlApi}customers/insertUser`;
  //   return this.http.post<Usuario>(url, register);
  // }
}
