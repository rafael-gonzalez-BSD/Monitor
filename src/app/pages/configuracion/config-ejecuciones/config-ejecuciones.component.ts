import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ModalFiltrosConfigEjecucionesComponent } from '../../../components/configuracion/config-ejecuciones/modal-filtros-config-ejecuciones/modal-filtros-config-ejecuciones.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-ejecuciones',
  templateUrl: './config-ejecuciones.component.html',
  styleUrls: ['./config-ejecuciones.component.scss']
})
export class ConfigEjecucionesComponent implements OnInit {

  constructor(
    private generalesService: GeneralesService,
    private router: Router,
    private modal: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('CONFIGURAR EJECUCIONES');
      }
    });
  }

  ngOnInit() {
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Filtros',
      opcion: 4
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosConfigEjecucionesComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '2');
    this.router.navigate(['site/menu']);
  }

}
