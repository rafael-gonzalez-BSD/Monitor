import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { GerenciaService } from '../../../../services/general/gerencia.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sistema } from 'src/app/models/inventario/sistema';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { RespuestaModel } from '../../../../models/base/respuesta';

@Component({
  selector: 'app-modal-guardar-sistema',
  templateUrl: './modal-guardar-sistema.component.html',
  styleUrls: ['./modal-guardar-sistema.component.scss']
})
export class ModalGuardarSistemaComponent implements OnInit {
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  insercion: boolean;
  // tslint:disable-next-line: ban-types
  datosCombo: RespuestaModel;
  grupoFormulario: FormGroup;
  sistemaModel = new Sistema();

  toggleBaja = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gerenciaService: GerenciaService,
    private sistemaService: SistemaService,
    private modal: MatDialog
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
    this.insercion = data.insercion;
  }
  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.consultarGerenciaCombo();
  }

  validarFormulario() {
    return new FormGroup({
      SistemaId: new FormControl(),
      SistemaDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      Alias: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      GerenciaId: new FormControl('', [Validators.required]),
      Descripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)])
    });
  }

  consultarGerenciaCombo() {
    this.gerenciaService.consultarGerenciaCombo().subscribe(
      (response: any) => {
        this.datosCombo = response;
        console.log(this.datosCombo);
      },
      err => {},
      () => {}
    );
  }
  get SistemaId() {
    return this.grupoFormulario.get('SistemaId');
  }
  get SistemaDescripcion() {
    return this.grupoFormulario.get('SistemaDescripcion');
  }
  get Baja() {
    return this.grupoFormulario.get('Baja');
  }
  get Alias() {
    return this.grupoFormulario.get('Alias');
  }
  get GerenciaId() {
    return this.grupoFormulario.get('GerenciaId');
  }
  get Descripcion() {
    return this.grupoFormulario.get('Descripcion');
  }

  guardarSistema(sistemaModel: Sistema) {
    if (this.grupoFormulario.valid) {
      this.insercion === true ? (this.opcion = 1) : (this.opcion = 3);

      this.sistemaModel = sistemaModel;
      this.sistemaModel.Opcion = this.opcion;
      this.sistemaModel.SistemaId = this.grupoFormulario.value.SistemaId;
      this.sistemaModel.SistemaDescripcion = this.grupoFormulario.value.SistemaDescripcion;
      this.sistemaModel.Baja = this.toggleBaja;
      this.sistemaModel.Alias = this.grupoFormulario.value.Alias;
      this.sistemaModel.GerenciaId = this.grupoFormulario.value.GerenciaId;
      this.sistemaModel.Descripcion = this.grupoFormulario.value.Descripcion;

      this.sistemaService.guardarSistema(sistemaModel, this.insercion).subscribe(
        (response: any) => {
          if (response.satisfactorio) {
            alert(response.mensaje);
            this.cerrarModal();
          } else {
            alert(response.mensaje);
          }
        },
        err => {
          alert('Ocurrió un error');
        },
        () => {}
      );
    }
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  changeMatToggle(event) {
    this.toggleBaja = !event.checked;
  }

  cerrarModal() {
    this.modal.closeAll();
  }
}