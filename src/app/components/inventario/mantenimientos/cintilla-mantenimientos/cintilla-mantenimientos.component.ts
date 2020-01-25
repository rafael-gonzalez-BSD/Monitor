import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cintilla-mantenimientos',
  templateUrl: './cintilla-mantenimientos.component.html',
  styleUrls: ['./cintilla-mantenimientos.component.scss']
})
export class CintillaMantenimientosComponent implements OnInit {
  filtroSistema = 'Todos';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';
  constructor(private mantenimientoService: MantenimientoService) { }

  ngOnInit() {
    this.mantenimientoService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'Todos';
      this.filtroFechaDesde = m.fechaDesde ? moment(m.fechaDesde).format('DD/MM/YYYY') : 'Todos';
      this.filtroFechaHasta = m.fechaHasta ? moment(m.fechaHasta).format('DD/MM/YYYY') : 'Todos';
    });
  }

}
