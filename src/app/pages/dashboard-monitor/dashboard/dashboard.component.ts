import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalFiltrosDashboardComponent } from '../../../components/dashboard-monitor/dashboard/modal-filtros-dashboard/modal-filtros-dashboard.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver,
    private modal: MatDialog) {
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('DASHBOARD');
      }
    });
  }

  ngOnInit() {
    /// TODO: Quitar esta linea de codigo una vez haya integrado los indicadores del dashboard.
    this.generalesService.quitarLoader();
    this.abrirModalFiltros();
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
    this.modal.open(ModalFiltrosDashboardComponent, dialogConfig);
  }

}
