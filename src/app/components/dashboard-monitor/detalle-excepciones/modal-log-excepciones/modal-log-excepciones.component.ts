import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-modal-log-excepciones',
  templateUrl: './modal-log-excepciones.component.html',
  styleUrls: ['./modal-log-excepciones.component.scss']
})
export class ModalLogExcepcionesComponent implements OnInit {
  datosLog: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog
  ) { 
    this.datosLog = data;
  }

  ngOnInit() {
  }

}
