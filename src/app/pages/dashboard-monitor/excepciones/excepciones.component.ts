import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalFiltroBitacoraExcepcionesComponent } from 'src/app/components/dashboard-monitor/bitacora-excepciones/modal-filtro-bitacora-excepciones/modal-filtro-bitacora-excepciones.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-excepciones',
  templateUrl: './excepciones.component.html',
  styleUrls: ['./excepciones.component.scss']
})
export class ExcepcionesComponent implements OnInit {

  constructor( 
    private modal: MatDialog,
    private router: Router,
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver
  ) { 
   }

  ngOnInit() {
    this.setearTitulo('BITÁCORA DE EXCEPCIONES');
    this.abrirModalFiltros();
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      tituloModal: 'Filtro',
    };
    
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalFiltroBitacoraExcepcionesComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/menu']);
  }

}
