import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Proceso } from '../../../../models/inventario/proceso';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { MatDialog, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Sistema } from '../../../../models/inventario/sistema';
import { Combo } from '../../../../models/base/combo';
import { RequireMatch } from '../../../../extensions/autocomplete/require-match';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { RespuestaModel } from '../../../../models/base/respuesta';

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
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  procesoModel = new Proceso();

  toggleBaja = true;
  toggleCritico = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sistemaService: SistemaService,
    private procesoService: ProcesoService,
    private modal: MatDialog,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
    this.datosEditar.baja = !data.baja;
    this.esEdicion = data.edit;
    this.consultarSistemaCombo();
  }

  ngOnInit() {


    this.grupoFormulario = this.validarFormulario();
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
    return this.datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName, 0));
  }

  validarFormulario() {
    return new FormGroup({
      procesoId: new FormControl(),
      procesoDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      sistemaId: new FormControl('', [Validators.required, RequireMatch]),
      baja: new FormControl(),
      critico: new FormControl()
    });
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;

    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (res: RespuestaModel) => {
        this.datosCombo = res.datos;
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de sistemas'));
      },
      () => { }
    );
  }

  guardarProceso(procesoModel: Proceso) {
    this.generalesService.mostrarLoader();
    if (this.grupoFormulario.valid) {
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
            this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
            this.procesoService.obtenerFiltros();
            this.procesoService.setearFiltros();
            this.cerrarModal();
          } else {
            this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
            alert(response.mensaje);
          }
        },
        err => {
          this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error.'));
        },
        () => {
          this.generalesService.quitarLoader();
        }
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
