import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Proceso } from '../../../../models/inventario/proceso';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Opcion } from '../../../../models/base/opcion';

@Component({
  selector: 'app-modal-guardar-proceso',
  templateUrl: './modal-guardar-proceso.component.html',
  styleUrls: ['./modal-guardar-proceso.component.scss']
})
export class ModalGuardarProcesoComponent implements OnInit {
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  esEdicion: boolean;
  datosCombo: Object[] = [];
  grupoFormulario: FormGroup;
  procesoModel = new Proceso();

  toggleBaja = true;
  toggleCritico = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sistemaService: SistemaService,
    private procesoService: ProcesoService,
    private modal: MatDialog
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
    this.esEdicion = data.edit;
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.consultarSistemaCombo();
  }

  validarFormulario() {
    return new FormGroup({
      procesoId: new FormControl(),
      procesoDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      sistemaId: new FormControl('', [Validators.required])
    });
  }

  consultarSistemaCombo() {
    this.sistemaService.consultarSistemaCombo().subscribe(
      (response: any) => {
        this.datosCombo = response;
      },
      err => {},
      () => {}
    );
  }

  guardarProceso(procesoModel: Proceso) {
    if (this.grupoFormulario.valid) {
      debugger;
      console.log('Modelo Proceso', procesoModel);
      this.procesoModel = procesoModel;
      this.procesoModel.opcion = this.opcion;
      if (this.grupoFormulario.value.procesoId) {
        this.procesoModel.procesoId = this.grupoFormulario.value.procesoId;
      }

      this.procesoModel.procesoDescripcion = this.grupoFormulario.value.procesoDescripcion;
      this.procesoModel.baja = this.toggleBaja;
      this.procesoModel.critico = this.toggleCritico;
      this.procesoModel.sistemaId = this.grupoFormulario.value.sistemaId;

      this.procesoService.guardarProceso(procesoModel, this.esEdicion).subscribe(
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
  get procesoId() {
    return this.grupoFormulario.get('procesoId');
  }
  get procesoDescripcion() {
    return this.grupoFormulario.get('procesoDescripcion');
  }
  get baja() {
    return this.grupoFormulario.get('baja');
  }
  get critico() {
    return this.grupoFormulario.get('critico');
  }
  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }

  resetForm() {
    this.grupoFormulario.reset();
  }
  changeEstadoMatToggle(event) {
    this.toggleBaja = !event.checked;
  }
  changeCriticoMatToggle(event) {
    this.toggleCritico = !event.checked;
  }
  cerrarModal() {
    this.modal.closeAll();
  }
}
