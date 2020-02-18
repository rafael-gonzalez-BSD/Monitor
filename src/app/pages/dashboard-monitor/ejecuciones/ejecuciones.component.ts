import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalFiltroBitacoraEjecucionesComponent } from 'src/app/components/dashboard-monitor/bitacora-ejecuciones/modal-filtro-bitacora-ejecuciones/modal-filtro-bitacora-ejecuciones.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ejecuciones',
  templateUrl: './ejecuciones.component.html',
  styleUrls: ['./ejecuciones.component.scss']
})
export class EjecucionesComponent implements OnInit {

  constructor(
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private modal: MatDialog,) {
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('BITÁCORA DE EJECUCIÓN');
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
      tituloModal: 'Filtro',
    };
    
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalFiltroBitacoraEjecucionesComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/menu']);
  }

}