import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalFiltrosMantenimientoComponent } from 'src/app/components/inventario/mantenimientos/modal-filtros-mantenimiento/modal-filtros-mantenimiento.component';
import { Mantenimiento } from 'src/app/models/inventario/mantenimiento';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.scss']
})
export class MantenimientosComponent implements OnInit {

  constructor(private modal: MatDialog, private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver,
    private router: Router) {
    // seteamos el  título del navbar movil
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('MANTENIMIENTOS');
      }
    });
  }

  ngOnInit() {
    this.resetearFiltrosMantenimientos();
    this.setearTitulo('MANTENIMIENTOS');
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

  regresar() {
    localStorage.setItem('indexMenu', '2');
    this.router.navigate(['site/menu']);
  }

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Filtro',
      opcion: 4
    };
    dialogConfig.data.fechaDesde = '';
    dialogConfig.data.fechaHasta = '';
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosMantenimientoComponent, dialogConfig);
  }

  resetearFiltrosMantenimientos() {
    const m = new Mantenimiento();
    m.opcion = 4;
    m.baja = null;
    m.sistemaId = 0;
    m.sistemaDescripcion = '';
    m.sistemaBaja = false;
    m.fechaDesde = null;
    m.fechaHasta = null;
    localStorage.removeItem('filtrosMantenimientos');
    localStorage.setItem('filtrosMantenimientos', JSON.stringify(m));
  }
}
