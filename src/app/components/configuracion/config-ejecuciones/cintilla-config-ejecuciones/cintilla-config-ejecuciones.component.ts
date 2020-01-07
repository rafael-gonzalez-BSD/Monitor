import { Component, OnInit } from '@angular/core';
import { ConfigEjecucionesService } from '../../../../services/configuracion/config-ejecuciones.service';

@Component({
  selector: 'app-cintilla-config-ejecuciones',
  templateUrl: './cintilla-config-ejecuciones.component.html',
  styleUrls: ['./cintilla-config-ejecuciones.component.scss']
})
export class CintillaConfigEjecucionesComponent implements OnInit {
  filtroSistema = 'Sin Filtro';
  filtroProceso = 'Sin Filtro';
  constructor(private configEjecucionesService: ConfigEjecucionesService) { }

  ngOnInit() {
    this.configEjecucionesService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'Sin Filtro';
      this.filtroProceso = m.procesoDescripcion || 'Sin Filtro';
    });
  }

}
