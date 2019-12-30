import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Mantenimiento } from 'src/app/models/inventario/mantenimiento';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Proceso } from 'src/app/models/inventario/proceso';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) { }

  obtenerFiltros() {
    const m: Mantenimiento = JSON.parse(localStorage.getItem('filtrosMantenimientos'));
    this.filtros.emit(m);
  }

  setearFiltros() {
    const m: Mantenimiento = JSON.parse(localStorage.getItem('filtrosMantenimientos'));
    this.setFiltros.emit(m);
  }

  guardarMantenimiento(mantenimiento: Mantenimiento, esEdicion: boolean): Observable<Mantenimiento> {
    const url = `${environment.urlApi}ventanaMantenimiento`;
    if (esEdicion) {
      return this.http.put<Mantenimiento>(url, mantenimiento);
    }
    return this.http.post<Mantenimiento>(url, mantenimiento);
  }

  obtenerMantenimientos(m: Mantenimiento) {
    let parametros = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in m) {
      parametros = parametros.set(key, m[key]);
    }

    const url = `${environment.urlApi}ventanaMantenimiento/all`;
    return this.http.get(url, { params: parametros });
  }

  actualizarEstado(m: Mantenimiento) {
    const url = `${environment.urlApi}ventanaMantenimiento`;
    return this.http.patch<Mantenimiento>(url, m);
  }
}
