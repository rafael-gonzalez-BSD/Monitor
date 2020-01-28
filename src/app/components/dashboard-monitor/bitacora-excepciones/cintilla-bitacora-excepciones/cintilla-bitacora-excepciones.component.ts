import { Component, OnInit } from '@angular/core';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';
import { convertFechaCintilla } from 'src/app/extensions/utils/utils';

@Component({
  selector: 'app-cintilla-bitacora-excepciones',
  templateUrl: './cintilla-bitacora-excepciones.component.html',
  styleUrls: ['./cintilla-bitacora-excepciones.component.scss']
})
export class CintillaBitacoraExcepcionesComponent implements OnInit {
  filtroFolio = 'Todos';
  filtroSistema = 'Todos';
  filtroEstatus = 'Abierta';
  filtroFechaDesde = 'Todos';
  filtroFechaHasta = 'Todos';

  constructor(private excepcionesService: ExcepcionesService) { }

  ngOnInit() {
    this.excepcionesService.setFiltros.subscribe((m: any) => {
      console.log(m)
      this.filtroFolio =  m.excepcionId === 0 ? 'Todos' : m.excepcionId;
      this.filtroSistema = m.sistemaDescripcion === '' ? 'Todos' : m.sistemaDescripcion;
      this.filtroEstatus = m.excepcionEstatusDescripcion;
      this.filtroFechaDesde = m.fechaDesde === '' ? 'Todos' : convertFechaCintilla( m.fechaDesde, 'YYYYMMDD');
      this.filtroFechaHasta = m.fechaHasta === '' ? 'Todos' : convertFechaCintilla( m.fechaHasta, 'YYYYMMDD');
    }, err => {
      console.log(err)

    });

    this.excepcionesService.setearFiltros();
  }

}
