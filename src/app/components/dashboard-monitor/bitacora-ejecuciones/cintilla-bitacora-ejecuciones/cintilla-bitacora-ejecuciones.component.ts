import { Component, OnInit } from '@angular/core';
import { EjecucionesService } from 'src/app/services/dashboard-monitor/ejecuciones.service';
import { convertFechaCintilla } from 'src/app/extensions/utils/utils';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { GeneralesService } from 'src/app/services/general/generales.service';

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

  constructor(private ejecucionesService: EjecucionesService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.ejecucionesService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroProceso = m.procesoDescripcion === '' ? 'Todos' : m.procesoDescripcion;
      this.filtroFechaDesde = m.fechaDesde === '' || m.fechaDesde === undefined ? 'Todos' : convertFechaCintilla( m.fechaDesde, 'YYYYMMDD', 'DDMMYYYY');
      this.filtroFechaHasta = m.fechaHasta === '' || m.fechaHasta === undefined ? 'Todos' : convertFechaCintilla( m.fechaHasta, 'YYYYMMDD', 'DDMMYYYY');
    }, err => {
      this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error al llamar los filtros`));

    });

    this.ejecucionesService.setearFiltros();
  }

}
