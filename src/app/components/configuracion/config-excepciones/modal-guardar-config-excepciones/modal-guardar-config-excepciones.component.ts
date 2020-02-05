import { NotificacionModel } from './../../../../models/base/notificacion';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigExcepciones } from 'src/app/models/configuracion/config-excepciones';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { GeneralesService } from '../../../../services/general/generales.service';
import { ConfigExcepcionesService } from '../../../../services/configuracion/config-excepciones.service';
import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import * as moment from 'moment';
import { fromTimeRequiredValidator, toTimeRequiredValidator, timeRangeValidator } from '../../../../extensions/picker/validate-date';
import { TimePickerTemplate } from 'src/app/extensions/picker/time-picker-template';
import { checkIfUrlExists } from '../../../../extensions/url-validator/url-validator';
import { Mantenimiento } from 'src/app/models/inventario/mantenimiento';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';

@Component({
  selector: 'app-modal-guardar-config-excepciones',
  templateUrl: './modal-guardar-config-excepciones.component.html',
  styleUrls: ['./modal-guardar-config-excepciones.component.scss']
})
export class ModalGuardarConfigExcepcionesComponent implements OnInit {
  submitted = false;
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  datosMantenimiento: Mantenimiento;
  esEdicion: boolean;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configExcepcionesModel = new ConfigExcepciones();
  regExp = '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$';
  timePickerTemplate = new TimePickerTemplate();
  terniumTheme: any;
  toggleBaja = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private generalesService: GeneralesService,
    private sistemaService: SistemaService,
    private mantenimientoService: MantenimientoService,
    private configExcepcionesService: ConfigExcepcionesService,
    private modal: MatDialog
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
    this.datosEditar.horaDesde = this.datosEditar.horaDesde === '' ? '' : this.getTimeValue(this.datosEditar.horaDesde);
    this.datosEditar.horaHasta = this.datosEditar.horaHasta === '' ? '' : this.getTimeValue(this.datosEditar.horaHasta);
    this.datosEditar.baja = data.edit ? !data.baja : true;
    this.datosEditar.ventanaMantenimiento = '';
    this.esEdicion = data.edit;
    if (this.esEdicion) {
      this.datosEditar.rutaExiste = this.esEdicion
      const m = new Combo();
      m.identificador = this.datosEditar.sistemaId;
      m.descripcion = this.datosEditar.sistemaDescripcion;
      this.consultarVentanaMantenimientoId(m);
    }
    this.terniumTheme = this.timePickerTemplate.terniumTheme;
    this.consultarSistemaCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name))
    );
    if (this.esEdicion) this.setearValorAutocomplete('sistemaId', this.data.sistemaId, this.data.sistemaDescripcion)

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
    return this.datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName, 0))
  }

  validarFormulario() {
    return new FormGroup({
      excepcionConfiguracionId: new FormControl(),
      frecuencia: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        Validators.min(1),
        Validators.max(32767),
        Validators.pattern('[(0-9)]*')]),
      rutaLog: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250)

      ]),
      rutaExiste: new FormControl('', [Validators.required, checkIfUrlExists]),
      horaDesde: new FormControl('', [
        fromTimeRequiredValidator,
        Validators.pattern(this.regExp)
      ]),
      horaHasta: new FormControl('', [
        toTimeRequiredValidator,
        Validators.pattern(this.regExp)
      ]),
      sistemaId: new FormControl('', [Validators.required, RequireMatch]),
      baja: new FormControl()
    }, timeRangeValidator);
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

  consultarVentanaMantenimientoId(value: Combo) {
    const m = new Mantenimiento();
    m.sistemaId = value.identificador;
    m.opcion = 2;

    this.mantenimientoService.obtenerMantenimiento(m).subscribe((res: RespuestaModel) => {
      if (res.satisfactorio) {
        this.datosMantenimiento = res.datos;
        const fechaInicio = `Fecha Inicio: ${moment(this.datosMantenimiento.fechaDesde).format('DD/MM/YYYY')} - Hora: ${this.getTimeValue(this.datosMantenimiento.horaDesde)} hrs`
        const fechaFin = `Fecha Fin: ${moment(this.datosMantenimiento.fechaHasta).format('DD/MM/YYYY')} - Hora ${this.getTimeValue(this.datosMantenimiento.horaHasta)} hrs`
        this.datosEditar.ventanaMantenimiento = `${fechaInicio}. ${fechaFin}`;

      }
      else {
        this.datosMantenimiento = new Mantenimiento();
        this.datosEditar.ventanaMantenimiento = '';
      }
    });
  }

  guardarConfiguracionExcepcion(configExcepcionesModel: ConfigExcepciones) {
    this.submitted = true;

    if (this.grupoFormulario.invalid) {
      return;
    }
    this.configExcepcionesModel = configExcepcionesModel;
    this.configExcepcionesModel.opcion = this.opcion;
    if (this.grupoFormulario.value.excepcionConfiguracionId) {
      this.configExcepcionesModel.excepcionConfiguracionId = this.grupoFormulario.value.excepcionConfiguracionId;
    }

    this.configExcepcionesModel.frecuencia = this.grupoFormulario.value.frecuencia;
    this.configExcepcionesModel.baja = !this.toggleBaja;
    this.configExcepcionesModel.horaDesde = this.grupoFormulario.value.horaDesde;
    this.configExcepcionesModel.horaHasta = this.grupoFormulario.value.horaHasta;
    this.configExcepcionesModel.rutaLog = this.grupoFormulario.value.rutaLog;
    this.configExcepcionesModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;

    this.configExcepcionesService.guardarConfigExcepcion(configExcepcionesModel, this.esEdicion).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
          this.configExcepcionesService.obtenerFiltros();
          this.configExcepcionesService.setearFiltros();
          this.cerrarModal();
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
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

  testearRuta() {
    const m = new ConfigExcepciones();
    m.rutaLog = this.grupoFormulario.value.rutaLog;
    this.generalesService.testearRutaArchivos(m).subscribe((res: any) => {
      this.datosEditar.rutaExiste = res.satisfactorio;
      const not = new NotificacionModel();
      not.tipo = res.satisfactorio ? 'success' : 'warning';
      not.mensaje = res.mensaje;

      this.generalesService.notificar(not);
    });
  }

  get excepcionConfiguracionId() {
    return this.grupoFormulario.get('excepcionConfiguracionId');
  }

  get rutaLog() {
    return this.grupoFormulario.get('rutaLog');
  }
  get horaDesde() {
    return this.grupoFormulario.get('horaDesde');
  }
  get horaHasta() {
    return this.grupoFormulario.get('horaHasta');
  }
  get baja() {
    return this.grupoFormulario.get('baja');
  }
  get rutaExiste() {
    return this.grupoFormulario.get('rutaExiste');
  }
  get frecuencia() {
    return this.grupoFormulario.get('frecuencia');
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
}
