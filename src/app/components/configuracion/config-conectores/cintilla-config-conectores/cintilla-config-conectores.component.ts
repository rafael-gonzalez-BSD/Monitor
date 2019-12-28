import { Component, OnInit } from '@angular/core';
import { ConfigConectoresService } from '../../../../services/configuracion/config-conectores.service';

@Component({
  selector: 'app-cintilla-config-conectores',
  templateUrl: './cintilla-config-conectores.component.html',
  styleUrls: ['./cintilla-config-conectores.component.scss']
})
export class CintillaConfigConectoresComponent implements OnInit {
  filtroSistema = 'N/A';
  filtroConector = 'N/A';
  constructor(private configConectoresService: ConfigConectoresService) { }

  ngOnInit() {
    this.configConectoresService.setFiltros.subscribe((m: any) => {
      this.filtroSistema = m.sistemaDescripcion || 'N/A';
      this.filtroConector = m.conectorConfiguracionDescripcion || 'N/A';
    });
  }

}
