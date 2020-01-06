import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cintilla-mantenimientos',
  templateUrl: './cintilla-mantenimientos.component.html',
  styleUrls: ['./cintilla-mantenimientos.component.scss']
})
export class CintillaMantenimientosComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroFechaDesde = 'N/A';
  filtroFechaHasta = 'N/A';
  constructor(private mantenimientoService: MantenimientoService) { }

  ngOnInit() {
    this.mantenimientoService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'N/A';
      this.filtroFechaDesde = m.fechaDesde ? moment(m.fechaDesde).format('DD/MM/YYYY') : 'N/A';
      this.filtroFechaHasta = m.fechaHasta ? moment(m.fechaHasta).format('DD/MM/YYYY') : 'N/A';
    });
  }

}
