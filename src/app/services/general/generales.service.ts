import { environment } from './../../../environments/environment.prod';
import { Injectable, EventEmitter } from '@angular/core';
import { NotificacionModel } from '../../models/base/notificacion';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralesService {
  setTituloMovil = new EventEmitter(true);
  notificacion = new EventEmitter();
  loader = new EventEmitter();

  constructor(private http: HttpClient) { }

  setearTituloMovil(t: string) {
    this.setTituloMovil.emit(t);
  }

  notificar(n: NotificacionModel) {
    this.notificacion.emit(n);
  }

  quitarLoader() {
    this.loader.emit(true);
  }

  mostrarLoader() {
    this.loader.emit(false);
  }

  testearRuta(m: any): Observable<any> {
    let parametros = new HttpParams();
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }
    const url = `${environment.urlApi}general/test`;
    return this.http.get(url, { params: parametros });
  }
}
