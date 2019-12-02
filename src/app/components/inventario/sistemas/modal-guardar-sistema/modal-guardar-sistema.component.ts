import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { GerenciaService } from '../../../../services/general/gerencia.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sistema } from 'src/app/models/inventario/sistema';
import { SistemaService } from '../../../../services/inventario/sistema.service';

@Component({
  selector: 'app-modal-guardar-sistema',
  templateUrl: './modal-guardar-sistema.component.html',
  styleUrls: ['./modal-guardar-sistema.component.scss']
})
export class ModalGuardarSistemaComponent implements OnInit {

  tituloModal: string;
  // tslint:disable-next-line: ban-types
  datosCombo: Object[] = [];
  grupoFormulario: FormGroup;
  sistemaModel = new Sistema();

  toggleBaja = true;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private gerenciaService: GerenciaService,
               private sistemaService: SistemaService ) {
    this.tituloModal =  data.tituloModal;
   }
   ngOnInit() {
     this.grupoFormulario = this.validarFormulario();
     this.consultarGerenciaCombo();
  }

  validarFormulario() {
    return new FormGroup({
      SistemaDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      // Baja: new FormControl(null, [Validators.required]),
      Alias: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      GerenciaId: new FormControl('', [Validators.required]),
      Descripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    });
  }

  consultarGerenciaCombo() {
    this.gerenciaService.consultarGerenciaCombo().subscribe((response: any) => {
      this.datosCombo =  response;
      console.log(this.datosCombo);
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

  guardarSistema(sistemaModel: Sistema) {
    if (this.grupoFormulario.valid) {
      console.log(this.toggleBaja);
      this.sistemaModel = sistemaModel;
      this.sistemaModel.Opcion = 1;
      this.sistemaModel.SistemaDescripcion = this.grupoFormulario.value.SistemaDescripcion;
      this.sistemaModel.Baja = this.toggleBaja;
      this.sistemaModel.Alias = this.grupoFormulario.value.Alias;
      this.sistemaModel.GerenciaId = 1; // this.grupoFormulario.value.GerenciaId;
      this.sistemaModel.Descripcion = this.grupoFormulario.value.Descripcion;

      console.log(this.sistemaModel);
      this.sistemaService.guardarSistema(sistemaModel).subscribe(
        (response: any) => {
          alert('Registro almacenado correctamente');
          console.log(response);
        },
        err => {
          alert('Ocurrió un error');
        },
        () => {
          // this.resetForm();
          alert('Tarea completada');
        }
      );
    }
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  changeMatToggle(event) {
    this.toggleBaja = !event.checked;
  }

}
