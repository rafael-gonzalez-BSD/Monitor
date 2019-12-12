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

  constructor(private sistemaService: SistemaService) { }

  ngOnInit() {
    // Recuperamos los filtros del evenEmitter
    this.sistemaService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'N/A';
      this.filtroEstado = m.sistemaDescripcion || 'N/A';
    });
  }

}
