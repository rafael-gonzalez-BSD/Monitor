import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Proceso } from '../../../../models/inventario/proceso';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { MatDialog, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Sistema } from '../../../../models/inventario/sistema';
import { Combo } from '../../../../models/base/combo';

@Component({
  selector: 'app-modal-guardar-proceso',
  templateUrl: './modal-guardar-proceso.component.html',
  styleUrls: ['./modal-guardar-proceso.component.scss']
})
export class ModalGuardarProcesoComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, null) auto: MatAutocompleteTrigger;
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  esEdicion: boolean;
  datosCombo: Combo[] = [];
  sistemaCombo: Observable<Combo[]>;
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
    this.datosEditar.baja = !data.baja;
    this.esEdicion = data.edit;
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.consultarSistemaCombo();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name))
    );

    if (this.esEdicion) this.setearValorAutocomplete('sistemaId', this.data.sistemaId, this.data.sistemaDescripcion);
  }
  setearValorAutocomplete(campo: string, id: number, desc: string) {
    this.grupoFormulario.get(campo).setValue({
      identificador: id,
      descripcion: desc
    });
  }
  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  filter(valor: string) {
    if (valor.length < 4) return [];

    const filterName = valor.toLowerCase();
    const datos: Combo[] = this.datosCombo['datos'];

    return datos.filter(option => option.descripcion.toLowerCase().includes(filterName, 0));
    // return this.sistemaService.consultarSistemaCombo(m);
  }

  validarFormulario() {
    return new FormGroup({
      procesoId: new FormControl(),
      procesoDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      sistemaId: new FormControl('', [Validators.required]),
      baja: new FormControl(),
      critico: new FormControl()
    });
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.Opcion = 3;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
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
      this.procesoModel.baja = !this.toggleBaja;
      this.procesoModel.critico = this.toggleCritico;
      this.procesoModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;

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
    this.toggleBaja = event.checked;
  }
  changeCriticoMatToggle(event) {
    this.toggleCritico = event.checked;
  }
  cerrarModal() {
    this.modal.closeAll();
  }
}
