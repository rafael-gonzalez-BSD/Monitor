import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { FiltrosConector } from 'src/app/models/dashboard-monitor/filtros-conector';
import { getFirstDayMonth, getLastDayMonth } from 'src/app/extensions/utils/utils';
import moment from 'moment';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit {

  constructor( private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) { 
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('BITÁCORA DE MONITOREO');
      }
    });
  }

  ngOnInit() {
    // this.resetearFiltrosConector();
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

  resetearFiltrosConector() {
    const m = new FiltrosConector();
    m.opcion = 4;
    m.conectorId = 0;
    m.conectorDescripcion = 'Todos'
    m.sistemaId = 0;
    m.sistemaDescripcion = 'Todos';   

    const primerDia = getFirstDayMonth(new Date());
    const ultimoDia = getLastDayMonth(new Date());

    m.fechaDesde = moment(new Date(primerDia)).format('YYYY/MM/DD');
    m.fechaHasta = moment(new Date(ultimoDia)).format('YYYY/MM/DD');

    localStorage.removeItem('filtrosConector');
    localStorage.setItem('filtrosConector', JSON.stringify(m));
  }
}
