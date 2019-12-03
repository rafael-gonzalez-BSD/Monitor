import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-filtros-sistema',
  templateUrl: './modal-filtros-sistema.component.html',
  styleUrls: ['./modal-filtros-sistema.component.scss']
})
export class ModalFiltrosSistemaComponent implements OnInit {
  tituloModal: string;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any ) { 
    this.tituloModal = data.tituloModal;
  }

  ngOnInit() {
  }

}
