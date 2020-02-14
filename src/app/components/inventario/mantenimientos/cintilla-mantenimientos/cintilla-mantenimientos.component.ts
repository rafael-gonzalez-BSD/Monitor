import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cintilla-mantenimientos',
  templateUrl: './cintilla-mantenimientos.component.html',
  styleUrls: ['./cintilla-mantenimientos.component.scss']
})
export class CintillaMantenimientosComponent implements OnInit {
  filtroSistema = 'Todos';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';
  constructor(private mantenimientoService: MantenimientoService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.mantenimientoService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'Todos';
      this.filtroFechaDesde = m.fechaDesde ? this.datePipe.transform(m.fechaDesde, 'dd/MMM/yyyy') : 'Todos';
      this.filtroFechaHasta = m.fechaHasta ? this.datePipe.transform(m.fechaHasta, 'dd/MMM/yyyy') : 'Todos';
    });
  }

}
