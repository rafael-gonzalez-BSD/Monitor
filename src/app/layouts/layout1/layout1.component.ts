import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Proceso } from '../../models/inventario/proceso';
import { Sistema } from '../../models/inventario/sistema';
import { Mantenimiento } from '../../models/inventario/mantenimiento';
import { ConfigExcepciones } from '../../models/configuracion/config-excepciones';

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
    //localStorage.setItem('indexMenu', '0');
  }

  ngOnInit() {
    this.resetearFiltrosProcesos();
    this.resetearFiltrosSistemas();
    this.resetearFiltrosMantenimientos();
    this.resetearFiltrosConfigExcepciones();

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
    localStorage.removeItem('filtrosMantenimientos');
    localStorage.setItem('filtrosMantenimientos', JSON.stringify(mantenimientoModel));
  }

  resetearFiltrosConfigExcepciones() {
    const configExcepcionesModel = new ConfigExcepciones();
    configExcepcionesModel.opcion = 4;
    configExcepcionesModel.sistemaId = 0;
    configExcepcionesModel.sistemaDescripcion = '';
    configExcepcionesModel.baja = null;
    localStorage.removeItem('filtrosConfigExcepciones');
    localStorage.setItem('filtrosConfigExcepciones', JSON.stringify(configExcepcionesModel));
  }
}
