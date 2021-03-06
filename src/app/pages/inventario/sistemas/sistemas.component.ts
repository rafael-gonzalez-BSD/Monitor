import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalFiltrosSistemaComponent } from '../../../components/inventario/sistemas/modal-filtros-sistema/modal-filtros-sistema.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MenuMovilComponent } from '../../../components/menu-movil/menu-movil.component';
import { Router } from '@angular/router';
import { GeneralesService } from '../../../services/general/generales.service';
import { Sistema } from 'src/app/models/inventario/sistema';

@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.scss']
})
export class SistemasComponent implements OnInit {
  constructor(
    private modal: MatDialog,
    private router: Router,
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver
  ) {
    // seteamos el  título del navbar movil
    // this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
    //   if (!state.matches) {
    //     this.setearTitulo('CATÁLOGO DE SISTEMAS');
    //   }
    // });
    this.setearTitulo('CATÁLOGO DE SISTEMAS');
  }

  ngOnInit() {
    this.setearTitulo('CATÁLOGO DE SISTEMAS');
    this.resetearFiltrosSistemas();
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
    this.modal.open(ModalFiltrosSistemaComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '2');
    this.router.navigate(['site/menu']);
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
}
