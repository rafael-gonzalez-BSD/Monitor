import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Proceso } from '../../../../models/inventario/proceso';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-guardar-proceso',
  templateUrl: './modal-guardar-proceso.component.html',
  styleUrls: ['./modal-guardar-proceso.component.scss']
})
export class ModalGuardarProcesoComponent implements OnInit {
  tituloModal: string;
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
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.consultarSistemaCombo();
  }

  validarFormulario() {
    return new FormGroup({
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
      this.procesoModel = procesoModel;
      this.procesoModel.opcion = 1;
      this.procesoModel.procesoDescripcion = this.grupoFormulario.value.procesoDescripcion;
      this.procesoModel.baja = this.toggleBaja;
      this.procesoModel.critico = this.toggleCritico;
      this.procesoModel.sistemaId = this.grupoFormulario.value.sistemaId;

      this.procesoService.guardarProceso(procesoModel).subscribe(
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
