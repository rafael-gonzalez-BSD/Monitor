import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalGuardarSistemaComponent } from '../../../components/inventario/sistemas/modal-guardar-sistema/modal-guardar-sistema.component';


@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.scss']
})
export class SistemasComponent implements OnInit {

  constructor( private dialog: MatDialog ) { }

  ngOnInit() {
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Agregar Sistema'
      };
    this.dialog.open(ModalGuardarSistemaComponent, dialogConfig);
  }

}
