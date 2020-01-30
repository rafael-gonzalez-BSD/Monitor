import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalFiltrosConfigExcepcionesComponent } from '../../../components/configuracion/config-excepciones/modal-filtros-config-excepciones/modal-filtros-config-excepciones.component';

@Component({
  selector: 'app-config-excepciones',
  templateUrl: './config-excepciones.component.html',
  styleUrls: ['./config-excepciones.component.scss']
})
export class ConfigExcepcionesComponent implements OnInit {

  constructor(
    private generalesService: GeneralesService,
    private router: Router,
    private modal: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('BITÁCORA DE EXCEPCIÓN');
      }
    });
  }

  ngOnInit() {
    this.setearTitulo('BITÁCORA DE EXCEPCIÓN');
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
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosConfigExcepcionesComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '1');
    this.router.navigate(['site/menu']);
  }

}
