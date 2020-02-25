import { Component, OnInit } from '@angular/core';
import { ConectoresService } from 'src/app/services/dashboard-monitor/conectores.service';
import { convertFechaCintilla } from 'src/app/extensions/utils/utils';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-cintilla-bitacora-conectores',
  templateUrl: './cintilla-bitacora-conectores.component.html',
  styleUrls: ['./cintilla-bitacora-conectores.component.scss']
})
export class CintillaBitacoraConectoresComponent implements OnInit {
  filtroSistema = 'Todos';
  filtroConector = 'Todos';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';

  constructor(
    private conectoresService: ConectoresService,
    private generalesService: GeneralesService
    ) { }

  ngOnInit() {
    this.conectoresService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroFechaDesde = m.fechaDesde === '' || m.fechaDesde === undefined ? 'Todos' : convertFechaCintilla( m.fechaDesde, 'YYYYMMDD', 'DDMMYYYY');
      this.filtroFechaHasta = m.fechaHasta === '' || m.fechaHasta === undefined ? 'Todos' : convertFechaCintilla( m.fechaHasta, 'YYYYMMDD', 'DDMMYYYY');
    }, err => {
      this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error`));

    });

    this.conectoresService.setearFiltros();
  }

}
