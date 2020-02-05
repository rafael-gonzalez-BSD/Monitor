import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigEjecuciones } from '../../../../models/configuracion/config-ejecuciones';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { SistemaService } from 'src/app/services/inventario/sistema.service';

import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';

import * as moment from 'moment';
import { ConfigEjecucionesService } from 'src/app/services/configuracion/config-ejecuciones.service';
import { Proceso } from 'src/app/models/inventario/proceso';
import { ProcesoService } from '../../../../services/inventario/proceso.service';
import { fromTimeRequiredValidator, toTimeRequiredValidator, timeRangeValidator } from '../../../../extensions/picker/validate-date';
import { TimePickerTemplate } from 'src/app/extensions/picker/time-picker-template';
import { checkIfUrlExists } from 'src/app/extensions/url-validator/url-validator';
import { MantenimientoService } from 'src/app/services/inventario/mantenimiento.service';
import { Mantenimiento } from 'src/app/models/inventario/mantenimiento';

@Component({
  selector: 'app-modal-guardar-config-ejecuciones',
  templateUrl: './modal-guardar-config-ejecuciones.component.html',
  styleUrls: ['./modal-guardar-config-ejecuciones.component.scss']
})
export class ModalGuardarConfigEjecucionesComponent implements OnInit {
  submitted = false;
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  datosMantenimiento: Mantenimiento;
  esEdicion: boolean;
  datosSistemaCombo: Combo[];
  datosProcesoCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  procesoCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configEjecucionesModel = new ConfigEjecuciones();
  timePickerTemplate = new TimePickerTemplate();
  terniumTheme: any;
  regExp = '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$';

  toggleBaja = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private generalesService: GeneralesService,
    private sistemaService: SistemaService,
    private procesoService: ProcesoService,
    private mantenimientoService: MantenimientoService,
    private configEjecucionesService: ConfigEjecucionesService,
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
    this.terniumTheme = this.timePickerTemplate.terniumTheme;
    this.consultarSistemaCombo();
    if (this.esEdicion) {
      this.datosEditar.rutaExiste = this.esEdicion;
      const m = new Combo();
      m.identificador = this.datosEditar.sistemaId;
      m.descripcion = this.datosEditar.sistemaDescripcion;
      this.consultarVentanaMantenimientoId(m);
      this.consultarProcesoCombo(m);
    }

    // this.consultarProcesoCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosSistemaCombo))
    );
    this.procesoCombo = this.grupoFormulario.get('procesoId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosProcesoCombo))
    );
    if (this.esEdicion) {
      this.setearValorAutocomplete('sistemaId', this.data.sistemaId, this.data.sistemaDescripcion)
      this.setearValorAutocomplete('procesoId', this.data.procesoId, this.data.procesoDescripcion)
    }
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

  filter(valor: string, datosCombo: Combo[]) {
    if (valor.length < 4) return [];
    const filterName = valor.toLowerCase();
    return datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName, 0))
  }

  validarFormulario() {
    return new FormGroup({
      ejecucionConfiguracionId: new FormControl(),
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
      procesoId: new FormControl('', [Validators.required, RequireMatch]),
      tiempoEstimadoEjecucion: new FormControl('', [Validators.required]),
      tiempoOptimoEjecucion: new FormControl('', [Validators.required]),
      baja: new FormControl()
    }, [timeRangeValidator, ejecucionTiempoValidate]);
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;

    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (res: RespuestaModel) => {
        this.datosSistemaCombo = res.datos;
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de sistemas'));
      },
      () => { }
    );
  }

  consultarProcesoCombo(value: Combo) {
    const m = new Proceso();
    m.opcion = 3;
    m.sistemaId = value.identificador;
    m.baja = false;

    this.procesoService.consultarProcesoCombo(m).subscribe(
      (res: RespuestaModel) => {
        this.datosProcesoCombo = res.datos;
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

  guardarConfiguracionEjecucion(configEjecucionesModel: ConfigEjecuciones) {
    this.submitted = true;
    if (this.grupoFormulario.invalid) {
      return;
    }
    this.configEjecucionesModel = configEjecucionesModel;
    this.configEjecucionesModel.opcion = this.opcion;
    if (this.grupoFormulario.value.ejecucionConfiguracionId) {
      this.configEjecucionesModel.ejecucionConfiguracionId = this.grupoFormulario.value.ejecucionConfiguracionId;
    }

    this.configEjecucionesModel.frecuencia = this.grupoFormulario.value.frecuencia;
    this.configEjecucionesModel.baja = !this.toggleBaja;
    this.configEjecucionesModel.horaDesde = this.grupoFormulario.value.horaDesde;
    this.configEjecucionesModel.horaHasta = this.grupoFormulario.value.horaHasta;
    this.configEjecucionesModel.rutaLog = this.grupoFormulario.value.rutaLog;
    this.configEjecucionesModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
    this.configEjecucionesModel.procesoId = this.grupoFormulario.value.procesoId.identificador;
    this.configEjecucionesModel.tiempoEstimadoEjecucion = this.grupoFormulario.value.tiempoEstimadoEjecucion
    this.configEjecucionesModel.tiempoOptimoEjecucion = this.grupoFormulario.value.tiempoOptimoEjecucion

    this.configEjecucionesService.guardarConfigEjecucion(configEjecucionesModel, this.esEdicion).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
          this.configEjecucionesService.obtenerFiltros();
          this.configEjecucionesService.setearFiltros();
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
    const m = new ConfigEjecuciones();
    m.rutaLog = this.grupoFormulario.value.rutaLog;
    this.generalesService.testearRutaArchivos(m).subscribe((res: any) => {
      this.datosEditar.rutaExiste = res.satisfactorio;
      const not = new NotificacionModel();
      not.tipo = res.satisfactorio ? 'success' : 'warning';
      not.mensaje = res.mensaje;

      this.generalesService.notificar(not);
    });
  }

  get ejecucionConfiguracionId() {
    return this.grupoFormulario.get('ejecucionConfiguracionId');
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
  get procesoId() {
    return this.grupoFormulario.get('procesoId');
  }
  get tiempoEstimadoEjecucion() {
    return this.grupoFormulario.get('tiempoEstimadoEjecucion');
  }
  get tiempoOptimoEjecucion() {
    return this.grupoFormulario.get('tiempoOptimoEjecucion');
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


export function ejecucionTiempoValidate(formGroupValues: FormGroup) {
  let tiempoEstimadoEjecucion = formGroupValues.get('tiempoEstimadoEjecucion').value;
  let tiempoOptimoEjecucion = formGroupValues.get('tiempoOptimoEjecucion').value;

  if ((tiempoEstimadoEjecucion !== '' || parseInt(tiempoEstimadoEjecucion) > 0) && (tiempoOptimoEjecucion !== '' || parseInt(tiempoOptimoEjecucion) > 0)) {


    if (parseInt(tiempoEstimadoEjecucion) < parseInt(tiempoOptimoEjecucion)) {
      return { invalidMoreThan: true };
    }
  }

  return null;
}