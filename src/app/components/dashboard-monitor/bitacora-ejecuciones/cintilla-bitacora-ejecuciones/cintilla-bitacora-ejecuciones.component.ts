import { Component, OnInit } from '@angular/core';
import { EjecucionesService } from 'src/app/services/dashboard-monitor/ejecuciones.service';
import { convertFechaCintilla } from 'src/app/extensions/utils/utils';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-cintilla-bitacora-ejecuciones',
  templateUrl: './cintilla-bitacora-ejecuciones.component.html',
  styleUrls: ['./cintilla-bitacora-ejecuciones.component.scss']
})
export class CintillaBitacoraEjecucionesComponent implements OnInit {
  filtroSistema = 'Todos';
  filtroProceso = 'Todos';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';
  generalesService: any;

  constructor(private ejecucionesService: EjecucionesService) { }

  ngOnInit() {
    this.ejecucionesService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroProceso = m.procesoDescripcion === '' ? 'Todos' : m.procesoDescripcion;
      this.filtroFechaDesde = m.fechaDesde === '' ? 'Todos' : convertFechaCintilla( m.fechaDesde, 'YYYYMMDD', 'DDMMYYYY');
      this.filtroFechaHasta = m.fechaHasta === '' ? 'Todos' : convertFechaCintilla( m.fechaHasta, 'YYYYMMDD', 'DDMMYYYY');
    }, err => {
      this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error`));

    });

    this.ejecucionesService.setearFiltros();
  }

}
