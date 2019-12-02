import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerenciaService {


  constructor(private http: HttpClient) { }

  consultarGerenciaCombo() {
    const  parametros = new  HttpParams().set('Opcion', '3');
    const url = `${environment.urlApi}gerencia/combo`;
    const resultado = this.http.get(url,  {params: parametros});
    return resultado;
  }
}
