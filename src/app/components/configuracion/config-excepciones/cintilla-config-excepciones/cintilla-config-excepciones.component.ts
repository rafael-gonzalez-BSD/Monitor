import { Component, OnInit } from '@angular/core';
import { ConfigExcepcionesService } from '../../../../services/configuracion/config-excepciones.service';

@Component({
  selector: 'app-cintilla-config-excepciones',
  templateUrl: './cintilla-config-excepciones.component.html',
  styleUrls: ['./cintilla-config-excepciones.component.scss']
})
export class CintillaConfigExcepcionesComponent implements OnInit {
  filtroSistema = 'Todos';
  constructor(private configExcepcionesService: ConfigExcepcionesService) { }

  ngOnInit() {
    this.configExcepcionesService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'Todos';
    });
  }

}
