import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit } from '@angular/core';
import { Proceso } from '../../../../models/inventario/proceso';

@Component({
  selector: 'app-cintilla-proceso',
  templateUrl: './cintilla-proceso.component.html',
  styleUrls: ['./cintilla-proceso.component.scss']
})
export class CintillaProcesoComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroProceso = 'N/A';
  constructor(private procesoService: ProcesoService) {}

  ngOnInit() {
    this.procesoService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'N/A';
      this.filtroProceso = m.procesoDescripcion || 'N/A';
    });
  }

  setearFiltros(m: Proceso) {}
}
