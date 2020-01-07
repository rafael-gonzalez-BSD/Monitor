import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { Sistema } from 'src/app/models/inventario/sistema';
import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';
import * as moment from 'moment';
import {
  toTimeRequiredValidator,
  fromTimeRequiredValidator,
  dateTimeRangeValidator,
  fromDateRequiredValidator,
  toDateRequiredValidator
} from '../../../../extensions/picker/validate-date';
import { TimePickerTemplate } from 'src/app/extensions/picker/time-picker-template';

@Component({
  selector: 'app-modal-guardar-mantenimiento',
  templateUrl: './modal-guardar-mantenimiento.component.html',
  styleUrls: ['./modal-guardar-mantenimiento.component.scss']
})
export class ModalGuardarMantenimientoComponent implements OnInit {
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  esEdicion: boolean;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  mantenimientoModel = new Mantenimiento();
  timePickerTemplate = new TimePickerTemplate();
  terniumTheme: any;
  regExp = '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$';

  toggleBaja = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sistemaService: SistemaService,
    private mantenimientoService: MantenimientoService,
    private modal: MatDialog,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = this.data.opcion;
    this.datosEditar = data;
    this.datosEditar.fechaDesde = this.datosEditar.fechaDesde === '' ? '' : new Date(this.datosEditar.fechaDesde);
    this.datosEditar.fechaHasta = this.datosEditar.fechaHasta === '' ? '' : new Date(this.datosEditar.fechaHasta);
    this.datosEditar.horaDesde = this.datosEditar.horaDesde === '' ? '' : this.getTimeValue(this.datosEditar.horaDesde);
    this.datosEditar.horaHasta = this.datosEditar.horaHasta === '' ? '' : this.getTimeValue(this.datosEditar.horaHasta);
    this.datosEditar.baja = data.edit ? !data.baja : true;
    this.esEdicion = data.edit;
    this.terniumTheme = this.timePickerTemplate.terniumTheme;
    this.consultarSistemaCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosCombo))
    );

    if (this.esEdicion) this.setearValorAutocomplete('sistemaId', this.data.sistemaId, this.data.sistemaDescripcion);
  }

  filter(valor: string, datosCombo: Combo[]) {
    if (valor.length < 4) return [];
    const filterName = valor.toLowerCase();
    return datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName));
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

  validarFormulario() {
    return new FormGroup({
      ventanaMantenimientoId: new FormControl(),
      fechaDesde: new FormControl('', [fromDateRequiredValidator]),
      horaDesde: new FormControl('', [fromTimeRequiredValidator, Validators.pattern(this.regExp)]),
      fechaHasta: new FormControl('', [toDateRequiredValidator]),
      horaHasta: new FormControl('', [toTimeRequiredValidator, Validators.pattern(this.regExp)]),
      sistemaId: new FormControl('', [Validators.required, RequireMatch]),
      baja: new FormControl()
    }, dateTimeRangeValidator);
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosCombo = response.datos;

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el combo de sistemas. ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrio un error.'));
      },
      () => { }
    );
  }

  guardarMantenimiento(m: Mantenimiento) {
    if (this.grupoFormulario.valid) {
      this.generalesService.mostrarLoader();

      this.mantenimientoModel = m;
      this.mantenimientoModel.opcion = this.opcion;
      if (this.grupoFormulario.value.ventanaMantenimientoId) {
        this.mantenimientoModel.ventanaMantenimientoId = this.grupoFormulario.value.ventanaMantenimientoId;
      }
      const fechaDesde: any = moment(this.grupoFormulario.value.fechaDesde).utcOffset(0);
      fechaDesde.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      fechaDesde.toISOString();
      fechaDesde.format();

      const fechaHasta: any = moment(this.grupoFormulario.value.fechaHasta).utcOffset(0);
      fechaHasta.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      fechaHasta.toISOString();
      fechaHasta.format();

      this.mantenimientoModel.fechaDesde = fechaDesde;
      this.mantenimientoModel.horaDesde = this.grupoFormulario.value.horaDesde;
      this.mantenimientoModel.fechaHasta = fechaHasta;
      this.mantenimientoModel.horaHasta = this.grupoFormulario.value.horaHasta;
      this.mantenimientoModel.baja = !this.toggleBaja;
      this.mantenimientoModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;

      console.log(this.mantenimientoModel);

      this.mantenimientoService.guardarMantenimiento(this.mantenimientoModel, this.esEdicion).subscribe(
        (response: any) => {
          if (response.satisfactorio) {
            this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
            this.mantenimientoService.obtenerFiltros();
            this.mantenimientoService.setearFiltros();
            this.cerrarModal();
          } else {
            this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
          }
        },
        err => {
          this.generalesService.notificar(new NotificacionModel('success', 'Ocurrió un error'));
        },
        () => {
          this.generalesService.quitarLoader();
        }
      );

    }
  }

  get ventanaMantenimientoId() {
    return this.grupoFormulario.get('ventanaMantenimientoId');
  }

  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }

  get fechaDesde() {
    return this.grupoFormulario.get('fechaDesde');
  }

  get horaDesde() {
    return this.grupoFormulario.get('horaDesde');
  }

  get fechaHasta() {
    return this.grupoFormulario.get('fechaHasta');
  }

  get horaHasta() {
    return this.grupoFormulario.get('horaHasta');
  }

  get baja() {
    return this.grupoFormulario.get('baja');
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  changeMatToggle(event) {
    this.toggleBaja = event.checked;
  }

  cerrarModal() {
    this.modal.closeAll();
  }

  getTimeValue(hour: string) {
    const totalMinutes = moment.duration(hour).asMinutes();

    let hours = 0;
    let minutes = 0;


    if (totalMinutes) {
      hours = Math.floor(totalMinutes / 60);
      minutes = Math.floor(totalMinutes % 60);
    }

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  getDateValue(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }
}
