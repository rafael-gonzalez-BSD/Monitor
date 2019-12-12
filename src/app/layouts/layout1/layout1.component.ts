import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Proceso } from '../../models/inventario/proceso';

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss']
})
export class Layout1Component implements OnInit {
  open = true;
  mostrarMenu1 = false;
  mostrarMenu2 = false;
  constructor(private sidebarService: SidebarService, private router: Router, private breakpointObserver: BreakpointObserver) {
    //localStorage.setItem('indexMenu', '0');
  }

  ngOnInit() {
    this.resetearFiltrosProcesos();

    this.sidebarService.change.subscribe(open => {
      this.open = open;
    });
  }

  resetearFiltrosProcesos() {
    const procesoModel = new Proceso(4);
    procesoModel.procesoId = 0;
    procesoModel.procesoDescripcion = '';
    procesoModel.sistemaId = 0;
    procesoModel.sistemaDescripcion = '';
    localStorage.removeItem('filtrosProcesos');
    localStorage.setItem('filtrosProcesos', JSON.stringify(procesoModel));
  }
}
