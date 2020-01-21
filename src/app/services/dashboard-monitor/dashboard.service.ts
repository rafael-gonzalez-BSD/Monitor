import { Injectable, EventEmitter } from '@angular/core';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  filterevent = new EventEmitter();

  constructor() { }
  setearFiltros() {
    const m: FiltrosDashboard = JSON.parse(localStorage.getItem('filtrosDashboard'));
    this.filterevent.emit(m);
  }
}
