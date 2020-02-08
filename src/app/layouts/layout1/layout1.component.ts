import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Proceso } from '../../models/inventario/proceso';
import { Sistema } from '../../models/inventario/sistema';
import { Mantenimiento } from '../../models/inventario/mantenimiento';
import { ConfigExcepciones } from '../../models/configuracion/config-excepciones';
import { ConfigEjecuciones } from 'src/app/models/configuracion/config-ejecuciones';
import { ConfigConectores } from '../../models/configuracion/config-conectores';
import { FiltrosDashboard } from '../../models/dashboard-monitor/filtrosDashboard';
import moment from 'moment';
import { log } from 'util';
import { FiltrosExcepcion } from 'src/app/models/dashboard-monitor/filtros-excepcion';
import { getFirstDayMonth, getLastDayMonth } from 'src/app/extensions/utils/utils';
import { GeneralesService } from '../../services/general/generales.service';
import { MonitorConfiguracion } from '../../models/base/monitor-configuracion';
import { RespuestaModel } from '../../models/base/respuesta';

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss']
})
export class Layout1Component implements OnInit {
  open = true;
  mostrarMenu1 = false;
  mostrarMenu2 = false;
  mostrarMenu3 = false;
  constructor(private sidebarService: SidebarService, private router: Router, private breakpointObserver: BreakpointObserver, private generalesService: GeneralesService) {
  }

  ngOnInit() {
    this.resetearFiltrosProcesos();
    this.resetearFiltrosSistemas();
    this.resetearFiltrosMantenimientos();
    this.resetearFiltrosConfigExcepciones();
    this.resetearFiltrosConfigEjecuciones();
    this.resetearFiltrosConfigConectores();
    this.resetearFiltrosDashboard();
    this.resetearFiltrosExcepcion();

    let m = new MonitorConfiguracion();
    m.identificador = 10;
    this.generalesService.obtenerConfiguracion(m).subscribe((res: RespuestaModel) => {
      if (res.satisfactorio) {
        localStorage.removeItem('diasPermitidos');
        localStorage.setItem('diasPermitidos', res.datos.valor.toString());
      }
    });

    localStorage.setItem('tamanioPaginar', '10');

    this.sidebarService.change.subscribe(open => {
      this.open = open;
    });
  }

  resetearFiltrosProcesos() {
    const m = new Proceso();
    m.opcion = 4;
    m.procesoId = 0;
    m.procesoDescripcion = '';
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    localStorage.removeItem('filtrosProcesos');
    localStorage.setItem('filtrosProcesos', JSON.stringify(m));
  }

  resetearFiltrosSistemas() {
    const m = new Sistema();
    m.opcion = 4;
    m.bajaDescripcion = 'Ambos';
    m.baja = null;
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    localStorage.removeItem('filtrosSistemas');
    localStorage.setItem('filtrosSistemas', JSON.stringify(m));
  }

  resetearFiltrosMantenimientos() {
    const m = new Mantenimiento();
    m.opcion = 4;
    m.baja = null;
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    m.fechaDesde = null;
    m.fechaHasta = null;
    localStorage.removeItem('filtrosMantenimientos');
    localStorage.setItem('filtrosMantenimientos', JSON.stringify(m));
  }

  resetearFiltrosConfigExcepciones() {
    const m = new ConfigExcepciones();
    m.opcion = 4;
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    localStorage.removeItem('filtrosConfigExcepciones');
    localStorage.setItem('filtrosConfigExcepciones', JSON.stringify(m));
  }

  resetearFiltrosConfigEjecuciones() {
    const m = new ConfigEjecuciones();
    m.opcion = 4;
    m.procesoId = 0;
    m.procesoDescripcion = '';
    m.procesoBaja = false;
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    localStorage.removeItem('filtrosConfigEjecuciones');
    localStorage.setItem('filtrosConfigEjecuciones', JSON.stringify(m));
  }

  resetearFiltrosConfigConectores() {
    const m = new ConfigConectores();
    m.opcion = 4;
    m.conectorConfiguracionId = 0;
    m.conectorConfiguracionDescripcion = '';
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    localStorage.removeItem('filtrosConfigConectores');
    localStorage.setItem('filtrosConfigConectores', JSON.stringify(m));
  }

  resetearFiltrosDashboard() {
    const m = new FiltrosDashboard();
    m.opcion = 5;
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;

    const primerDia = getFirstDayMonth(new Date());
    const ultimoDia = getLastDayMonth(new Date());

    m.fechaDesdeCorta = moment(new Date(primerDia)).format('MM/YYYY');
    m.fechaDesde = moment(new Date(primerDia)).format('YYYY/MM/DD');
    m.fechaHasta = moment(new Date(ultimoDia)).format('YYYY/MM/DD');

    localStorage.removeItem('filtrosDashboard');
    localStorage.setItem('filtrosDashboard', JSON.stringify(m));
  }

  resetearFiltrosExcepcion() {
    const m = new FiltrosExcepcion();
    m.opcion = 4;
    m.excepcionId = 0;
    m.excepcionEstatusId = 1;
    m.excepcionEstatusDescripcion = 'Abierta';
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;

    const primerDia = getFirstDayMonth(new Date());
    const ultimoDia = getLastDayMonth(new Date());

    m.fechaDesde = moment(new Date(primerDia)).format('YYYY/MM/DD');
    m.fechaHasta = moment(new Date(ultimoDia)).format('YYYY/MM/DD');

    localStorage.removeItem('filtrosExcepcion');
    localStorage.setItem('filtrosExcepcion', JSON.stringify(m));
  }

}
