import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalFiltrosConfigExcepcionesComponent } from '../../../components/configuracion/config-excepciones/modal-filtros-config-excepciones/modal-filtros-config-excepciones.component';
import { ConfigExcepciones } from 'src/app/models/configuracion/config-excepciones';

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
  ) {}

  ngOnInit() {
    this.setearTitulo('BITÁCORA DE EXCEPCIÓN');
    this.resetearFiltrosConfigExcepciones();
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
    this.modal.open(ModalFiltrosConfigExcepcionesComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '1');
    this.router.navigate(['site/menu']);
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
}
