import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ModalFiltrosSistemaComponent } from '../../../components/inventario/sistemas/modal-filtros-sistema/modal-filtros-sistema.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'app-sistemas',
  templateUrl: './sistemas.component.html',
  styleUrls: ['./sistemas.component.scss']
})
export class SistemasComponent implements OnInit {

  constructor(private modal: MatDialog, public breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    // if (this.breakpointObserver.isMatched('(min-width: 500px)')) {
    //   console.log('Enough room!');
    // }
    
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
