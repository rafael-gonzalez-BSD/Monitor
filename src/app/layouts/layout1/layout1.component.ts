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
  constructor(private sidebarService: SidebarService, private router: Router, private breakpointObserver: BreakpointObserver) {
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

    this.sidebarService.change.subscribe(open => {
      this.open = open;
    });
  }

  resetearFiltrosProcesos() {
    const procesoModel = new Proceso();
    procesoModel.opcion = 4;
    procesoModel.procesoId = 0;
    procesoModel.procesoDescripcion = '';
    procesoModel.sistemaId = 0;
    procesoModel.sistemaDescripcion = '';
    localStorage.removeItem('filtrosProcesos');
    localStorage.setItem('filtrosProcesos', JSON.stringify(procesoModel));
  }

  resetearFiltrosSistemas() {
    const sistemaModel = new Sistema();
    sistemaModel.opcion = 4;
    sistemaModel.bajaDescripcion = 'Ambos';
    sistemaModel.baja = null;
    sistemaModel.sistemaId = 0;
    sistemaModel.sistemaDescripcion = '';
    localStorage.removeItem('filtrosSistemas');
    localStorage.setItem('filtrosSistemas', JSON.stringify(sistemaModel));
  }

  resetearFiltrosMantenimientos() {
    const mantenimientoModel = new Mantenimiento();
    mantenimientoModel.opcion = 4;
    mantenimientoModel.baja = null;
    mantenimientoModel.sistemaId = 0;
    mantenimientoModel.sistemaDescripcion = '';
    mantenimientoModel.fechaDesde = null;
    mantenimientoModel.fechaHasta = null;
    localStorage.removeItem('filtrosMantenimientos');
    localStorage.setItem('filtrosMantenimientos', JSON.stringify(mantenimientoModel));
  }

  resetearFiltrosConfigExcepciones() {
    const configExcepcionesModel = new ConfigExcepciones();
    configExcepcionesModel.opcion = 4;
    configExcepcionesModel.sistemaId = 0;
    configExcepcionesModel.sistemaDescripcion = '';
    localStorage.removeItem('filtrosConfigExcepciones');
    localStorage.setItem('filtrosConfigExcepciones', JSON.stringify(configExcepcionesModel));
  }

  resetearFiltrosConfigEjecuciones() {
    const configEjecucionesModel = new ConfigEjecuciones();
    configEjecucionesModel.opcion = 4;
    configEjecucionesModel.procesoId = 0;
    configEjecucionesModel.procesoDescripcion = '';
    configEjecucionesModel.sistemaId = 0;
    configEjecucionesModel.sistemaDescripcion = '';
    localStorage.removeItem('filtrosConfigEjecuciones');
    localStorage.setItem('filtrosConfigEjecuciones', JSON.stringify(configEjecucionesModel));
  }

  resetearFiltrosConfigConectores() {
    const configConectoresModel = new ConfigConectores();
    configConectoresModel.opcion = 4;
    configConectoresModel.conectorConfiguracionId = 0;
    configConectoresModel.conectorConfiguracionDescripcion = '';
    configConectoresModel.sistemaId = 0;
    configConectoresModel.sistemaDescripcion = '';
    localStorage.removeItem('filtrosConfigConectores');
    localStorage.setItem('filtrosConfigConectores', JSON.stringify(configConectoresModel));
  }

  resetearFiltrosDashboard() {
    const filtrosDashboardModel = new FiltrosDashboard();
    filtrosDashboardModel.opcion = 5;
    filtrosDashboardModel.sistemaId = 0;
    filtrosDashboardModel.sistemaDescripcion = '';

    const primerDia = getFirstDayMonth(new Date());
    const ultimoDia = getLastDayMonth(new Date());

    filtrosDashboardModel.fechaDesdeCorta = moment( new Date(primerDia)).format('MM/YYYY'); 
    filtrosDashboardModel.fechaDesde = moment( new Date(primerDia)).format('YYYY/MM/DD'); 
    filtrosDashboardModel.fechaHasta = moment( new Date(ultimoDia)).format('YYYY/MM/DD'); 

    localStorage.removeItem('filtrosDashboard');
    localStorage.setItem('filtrosDashboard', JSON.stringify(filtrosDashboardModel));
  }

  resetearFiltrosExcepcion() {
    const filtrosExcepcion = new FiltrosExcepcion();
    filtrosExcepcion.opcion = 5;
    filtrosExcepcion.excepcionId = 0;
    filtrosExcepcion.excepcionEstatusId = 1;
    filtrosExcepcion.excepcionEstatusDescripcion = 'Abierta';
    filtrosExcepcion.sistemaId = 0;
    filtrosExcepcion.sistemaDescripcion = '';

    const primerDia = getFirstDayMonth(new Date());
    const ultimoDia = getLastDayMonth(new Date());    

    filtrosExcepcion.fechaDesde = moment( new Date(primerDia)).format('YYYY/MM/DD'); 
    filtrosExcepcion.fechaHasta = moment( new Date(ultimoDia)).format('YYYY/MM/DD'); 

    localStorage.setItem('fechaDesdeBitacoras', moment( new Date(primerDia)).format('YYYY/MM/DD'));
    localStorage.setItem('fechaHastaBitacoras', moment( new Date(ultimoDia)).format('YYYY/MM/DD'));
    localStorage.setItem('sistemaIdBitacoras', filtrosExcepcion.sistemaId.toString());
    localStorage.setItem('sistemaDescripcionBitacoras', filtrosExcepcion.sistemaDescripcion);

    localStorage.removeItem('filtrosExcepcion');
    localStorage.setItem('filtrosExcepcion', JSON.stringify(filtrosExcepcion));
  }

}
