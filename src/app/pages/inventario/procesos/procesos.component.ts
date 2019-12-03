import { ProcesoService } from './../../../services/inventario/proceso.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalGuardarProcesoComponent } from '../../../components/inventario/procesos/modal-guardar-proceso/modal-guardar-proceso.component';
// tslint:disable-next-line: max-line-length
import { ModalFiltrosProcesoComponent } from '../../../components/inventario/procesos/modal-filtros-proceso/modal-filtros-proceso.component';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  constructor(private modal: MatDialog) {}

  ngOnInit() {}

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Filtros'
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosProcesoComponent, dialogConfig);
  }
}
