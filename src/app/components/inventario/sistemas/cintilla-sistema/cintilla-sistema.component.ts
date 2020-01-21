import { Component, OnInit } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { log } from 'util';

@Component({
  selector: 'app-cintilla-sistema',
  templateUrl: './cintilla-sistema.component.html',
  styleUrls: ['./cintilla-sistema.component.scss']
})
export class CintillaSistemaComponent implements OnInit {
  filtroSistema = 'Sin Filtro';
  filtroEstado = 'Sin Filtro';

  constructor(private sistemaService: SistemaService) {}

  ngOnInit() {
    // Recuperamos los filtros del evenEmitter
    this.sistemaService.setFiltros.subscribe((m: any) => {
      console.log(m)
      this.filtroSistema = m.sistemaDescripcion || 'Sin Filtro';
      if (m.baja === null) this.filtroEstado = 'Ambos';
      if (m.baja === true || m.baja === 'true') this.filtroEstado = 'Apagado';
      if (m.baja === false || m.baja === 'false') this.filtroEstado = 'Encendido';
    });
  }
}
