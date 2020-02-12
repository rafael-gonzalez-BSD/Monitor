import { Component, OnInit } from '@angular/core';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModalFiltrosConfigConectoresComponent } from '../../../components/configuracion/config-conectores/modal-filtros-config-conectores/modal-filtros-config-conectores.component';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';

@Component({
  selector: 'app-config-conectores',
  templateUrl: './config-conectores.component.html',
  styleUrls: ['./config-conectores.component.scss']
})
export class ConfigConectoresComponent implements OnInit {

  constructor(
    private generalesService: GeneralesService,
    private router: Router,
    private modal: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    
  }

  ngOnInit() {
    this.setearTitulo('BITÁCORA DE MONITOREO');
    this.resetearFiltrosConfigConectores();
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
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalFiltrosConfigConectoresComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '1');
    this.router.navigate(['site/menu']);
  }

  resetearFiltrosConfigConectores() {
    const m = new ConfigConectores();
    m.opcion = 4;
    m.conectorConfiguracionId = 0;
    m.conectorConfiguracionDescripcion = '';
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    localStorage.removeItem('filtrosConfigConectores');
    localStorage.setItem('filtrosConfigConectores', JSON.stringify(m));
  }
}
