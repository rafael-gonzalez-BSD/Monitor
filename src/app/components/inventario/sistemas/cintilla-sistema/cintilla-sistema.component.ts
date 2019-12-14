import { Component, OnInit } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';

@Component({
  selector: 'app-cintilla-sistema',
  templateUrl: './cintilla-sistema.component.html',
  styleUrls: ['./cintilla-sistema.component.scss']
})
export class CintillaSistemaComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroEstado = 'N/A';

  constructor(private sistemaService: SistemaService) {}

  ngOnInit() {
    // Recuperamos los filtros del evenEmitter
    this.sistemaService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'N/A';
      if (m.baja === null) this.filtroEstado = 'Ambos';
      if (m.baja === true) this.filtroEstado = 'Apagado';
      if (m.baja === false) this.filtroEstado = 'Encendido';
    });
  }
}
