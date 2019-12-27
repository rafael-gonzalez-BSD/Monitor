import { Injectable } from '@angular/core';
import { EventEmitter } from 'protractor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigEjecucionesService {
  filtros = new EventEmitter();
  setFiltros = new EventEmitter();
  constructor(private http: HttpClient) { }

  obtenerFiltros() {

  }
}
