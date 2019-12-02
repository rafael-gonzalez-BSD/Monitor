import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GerenciaService } from '../../../../services/general/gerencia.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sistema } from 'src/app/models/inventario/sistema';

@Component({
  selector: 'app-modal-guardar-sistema',
  templateUrl: './modal-guardar-sistema.component.html',
  styleUrls: ['./modal-guardar-sistema.component.scss']
})
export class ModalGuardarSistemaComponent implements OnInit {
  
  tituloModal: string;
  // tslint:disable-next-line: ban-types
  datos: Object[] = [];
  grupoFormulario: FormGroup;
  sistemaModel = new Sistema();


  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private gerenciaService: GerenciaService ) {
    this.tituloModal =  data.tituloModal;
   }
   ngOnInit() {
     this.grupoFormulario = this.validarFormulario();
  }
  validarFormulario() {
    return new FormGroup({
      SistemaDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      Baja: new FormControl(null, [Validators.required]),
      Alias: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      GerenciaId: new FormControl('', [Validators.required]),
      Descripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    });
  }

  consultarGerenciaCombo() {
    this.gerenciaService.consultarGerenciaCombo().subscribe((res: any) => {
      this.datos =  res;
      console.log(this.datos);
    },
    err => {
    },
    () => {

    });
  }

  get SistemaDescripcion() { return this.grupoFormulario.get('SistemaDescripcion'); }
  get Baja() { return this.grupoFormulario.get('Baja'); }
  get Alias() { return this.grupoFormulario.get('Alias'); }
  get GerenciaId() { return this.grupoFormulario.get('GerenciaId'); }
  get Descripcion() { return this.grupoFormulario.get('Descripcion'); }

}
