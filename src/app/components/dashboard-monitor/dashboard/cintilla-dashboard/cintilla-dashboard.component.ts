import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../services/dashboard-monitor/dashboard.service';
import moment from 'moment';
import { debug, log } from 'util';

@Component({
  selector: 'app-cintilla-dashboard',
  templateUrl: './cintilla-dashboard.component.html',
  styleUrls: ['./cintilla-dashboard.component.scss']
})
export class CintillaDashboardComponent implements OnInit {

  filtroSistema = 'Todos';
  filtroFecha = 'Todos';
  constructor(private dashboardService: DashboardService) {

  }

  ngOnInit() {
    this.dashboardService.filterevent.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroFecha = m.fechaOcurrenciaCorta === '' ? 'mm/aaaa' : m.fechaOcurrenciaCorta;
    }, err => {
      console.log(err)

    });

    this.dashboardService.setearFiltros();
  }

}
