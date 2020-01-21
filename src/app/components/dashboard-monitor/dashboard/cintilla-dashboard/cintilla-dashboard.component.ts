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

  filtroSistema = 'Sin Filtro';
  filtroFecha = 'Sin Filtro';
  constructor(private dashboardService: DashboardService) {
    
   }

  ngOnInit() {
    this.dashboardService.filterevent.subscribe((m: any) => {
      console.log(m);
      this.filtroSistema = m.sistemaDescripcion === ''? 'Sin Filtro' : m.sistemaDescripcion;
      this.filtroFecha = m.fecha ? moment(m.fecha).format('MM/YYYY') : 'Sin Filtro';
    }, err =>  {
      console.log(err)

    });

    this.dashboardService.setearFiltros();
  }

}