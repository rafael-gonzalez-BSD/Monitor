import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../services/dashboard-monitor/dashboard.service';
import moment from 'moment';
import { debug, log } from 'util';
import { convertFechaCintilla } from 'src/app/extensions/utils/utils';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-cintilla-dashboard',
  templateUrl: './cintilla-dashboard.component.html',
  styleUrls: ['./cintilla-dashboard.component.scss']
})
export class CintillaDashboardComponent implements OnInit {

  filtroSistema = 'Todos';
  filtroFecha = 'Todos';
  constructor(private dashboardService: DashboardService, private generalesService: GeneralesService) {

  }

  ngOnInit() {
    this.dashboardService.filterevent.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroFecha = m.fechaDesdeCorta === '' ? 'Todos' : convertFechaCintilla( m.fechaDesde, 'YYYYMMDD', 'MMMYYYY' );
    }, err => {
      this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error`));

    });

    this.dashboardService.setearFiltros();
  }

}
