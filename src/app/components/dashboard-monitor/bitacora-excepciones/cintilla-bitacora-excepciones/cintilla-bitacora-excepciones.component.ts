import { Component, OnInit } from '@angular/core';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';
import { convertFechaCintilla } from 'src/app/extensions/utils/utils';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-cintilla-bitacora-excepciones',
  templateUrl: './cintilla-bitacora-excepciones.component.html',
  styleUrls: ['./cintilla-bitacora-excepciones.component.scss']
})
export class CintillaBitacoraExcepcionesComponent implements OnInit {
  filtroFolio = 'Todos';
  filtroSistema = 'Todos';
  filtroEstatus = 'Abierta';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';

  constructor(private excepcionesService: ExcepcionesService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.excepcionesService.setFiltros.subscribe((m: any) => {
      this.filtroFolio =  m.excepcionId === 0 ? 'Todos' : m.excepcionId;
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroEstatus = m.excepcionEstatusDescripcion;
      this.filtroFechaDesde = m.fechaDesde === '' || m.fechaDesde === undefined ? 'Todos' : convertFechaCintilla( m.fechaDesde, 'YYYYMMDD', 'DDMMYYYY');
      this.filtroFechaHasta = m.fechaHasta === '' || m.fechaHasta === undefined ? 'Todos' : convertFechaCintilla( m.fechaHasta, 'YYYYMMDD', 'DDMMYYYY');
    }, err => {
      this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error`));

    });

    this.excepcionesService.setearFiltros();
  }

}
