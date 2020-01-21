import { Injectable, EventEmitter } from '@angular/core';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  setFiltros = new EventEmitter();

  constructor() { }

  setearFiltros() {
    const m: FiltrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    this.setFiltros.emit(m);
  }
}
