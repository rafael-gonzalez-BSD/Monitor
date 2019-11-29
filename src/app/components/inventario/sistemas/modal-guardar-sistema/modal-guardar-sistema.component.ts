import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-guardar-sistema',
  templateUrl: './modal-guardar-sistema.component.html',
  styleUrls: ['./modal-guardar-sistema.component.scss']
})
export class ModalGuardarSistemaComponent implements OnInit {
  tituloModal: string;
  value = '1';

  constructor( @Inject(MAT_DIALOG_DATA) public data: any ) {
    this.tituloModal =  data.tituloModal;
   }

  ngOnInit() {
  }

}
