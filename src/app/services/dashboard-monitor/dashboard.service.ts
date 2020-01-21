import { Injectable, EventEmitter } from '@angular/core';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  filterevent = new EventEmitter();
  filtros = new EventEmitter();

  constructor() { }

  obtenerFiltros() {
    const m: FiltrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    this.filtros.emit(m);
  }

  setearFiltros() {
    const m: FiltrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    this.filterevent.emit(m);
  }
}
