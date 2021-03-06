import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalFiltrosProcesoComponent } from '../../../components/inventario/procesos/modal-filtros-proceso/modal-filtros-proceso.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from '../../../services/general/generales.service';
import { Router } from '@angular/router';
import { Proceso } from 'src/app/models/inventario/proceso';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  constructor(
    private generalesService: GeneralesService,
    private router: Router,
    private modal: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    // seteamos el  título del navbar movil
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('CATÁLOGO DE PROCESOS');
      }
    });
  }

  ngOnInit() {
    this.setearTitulo('CATÁLOGO DE PROCESOS');
    this.resetearFiltrosProcesos();
  }
  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Filtro',
      opcion: 4
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosProcesoComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '2');
    this.router.navigate(['site/menu']);
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
}
