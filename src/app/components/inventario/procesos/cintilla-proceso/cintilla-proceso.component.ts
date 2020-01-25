import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit } from '@angular/core';
import { Proceso } from '../../../../models/inventario/proceso';

@Component({
  selector: 'app-cintilla-proceso',
  templateUrl: './cintilla-proceso.component.html',
  styleUrls: ['./cintilla-proceso.component.scss']
})
export class CintillaProcesoComponent implements OnInit {
  filtroSistema = 'Todos';
  filtroProceso = 'Todos';
  constructor(private procesoService: ProcesoService) {}

  ngOnInit() {
    this.procesoService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'Todos';
      this.filtroProceso = m.procesoDescripcion || 'Todos';
    });
  }
}
