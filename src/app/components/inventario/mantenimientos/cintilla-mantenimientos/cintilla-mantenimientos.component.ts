import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { Sistema } from '../../../../models/inventario/sistema';

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
      this.filtroFechaDesde = m.fechaDesde || 'N/A';
      this.filtroFechaHasta = m.fechaHasta || 'N/A';
    });
  }

}
