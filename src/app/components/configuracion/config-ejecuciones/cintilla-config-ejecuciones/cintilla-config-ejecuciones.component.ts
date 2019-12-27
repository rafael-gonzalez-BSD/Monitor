import { Component, OnInit } from '@angular/core';
import { ConfigEjecucionesService } from '../../../../services/configuracion/config-ejecuciones.service';

@Component({
  selector: 'app-cintilla-config-ejecuciones',
  templateUrl: './cintilla-config-ejecuciones.component.html',
  styleUrls: ['./cintilla-config-ejecuciones.component.scss']
})
export class CintillaConfigEjecucionesComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroProceso = 'N/A';
  constructor(private configEjecucionesService: ConfigEjecucionesService) { }

  ngOnInit() {
    this.configEjecucionesService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'N/A';
      this.filtroProceso = m.procesoDescripcion || 'N/A';
    });
  }

}
