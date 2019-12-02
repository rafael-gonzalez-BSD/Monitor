import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalGuardarSistemaComponent } from '../../../components/inventario/sistemas/modal-guardar-sistema/modal-guardar-sistema.component';
// tslint:disable-next-line: max-line-length
import { ModalFiltrosSistemaComponent } from '../../../components/inventario/sistemas/modal-filtros-sistema/modal-filtros-sistema.component';


@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.scss']
})
export class SistemasComponent implements OnInit {

  constructor(private modal: MatDialog) { }

  ngOnInit() {
    
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Agregar Sistema'
    };
    dialogConfig.height = 'auto';
    this.modal.open(ModalGuardarSistemaComponent, dialogConfig);
  }

  abrirModalFiltros() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Filtros'
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalFiltrosSistemaComponent, dialogConfig);
  }

}
