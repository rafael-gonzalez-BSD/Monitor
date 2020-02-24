import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalFiltrosDashboardComponent } from '../../../components/dashboard-monitor/dashboard/modal-filtros-dashboard/modal-filtros-dashboard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  

  constructor(
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private modal: MatDialog) {
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('DASHBOARD');
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
      tituloModal: 'Filtro',
      opcion: 4
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosDashboardComponent, dialogConfig);
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/menu']);
  }

}
