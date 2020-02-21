import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteTrigger, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { ConfigConectoresService } from 'src/app/services/configuracion/config-conectores.service';
import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import * as moment from 'moment';
import { fromTimeRequiredValidator, toTimeRequiredValidator, timeRangeValidator } from 'src/app/extensions/picker/validate-date';
import { TimePickerTemplate } from 'src/app/extensions/picker/time-picker-template';
import { inputText } from 'src/app/extensions/custom-validator/validations';
import { checkIfUrlExists } from '../../../../extensions/url-validator/url-validator';

@Component({
  selector: 'app-modal-guardar-config-conectores',
  templateUrl: './modal-guardar-config-conectores.component.html',
  styleUrls: ['./modal-guardar-config-conectores.component.scss']
})
export class ModalGuardarConfigConectoresComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, null) auto: MatAutocompleteTrigger;
  submitted = false;
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  esEdicion: boolean;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configConectoresModel = new ConfigConectores();
  timePickerTemplate = new TimePickerTemplate();
  terniumTheme: any;
  regExp = '^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$';

  toggleBaja = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private generalesService: GeneralesService,
    private sistemaService: SistemaService,
    private configConectoresService: ConfigConectoresService,
    private modal: MatDialog
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
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
    return this.datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName, 0))
  }

  validarFormulario() {
    return new FormGroup({
      conectorConfiguracionId: new FormControl(),
      frecuencia: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        Validators.min(1),
        Validators.max(32767),
        Validators.pattern('[(0-9)]*')]),
      conectorConfiguracionDescripcion: new FormControl('', [inputText(true, 3, 100)]),
      urlApi: new FormControl('', [
        inputText(true, 3, 250),
        // Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]),
      rutaExiste: new FormControl('', [Validators.required, checkIfUrlExists]),
      horaDesde: new FormControl('', [fromTimeRequiredValidator, Validators.pattern(this.regExp)]),
      horaHasta: new FormControl('', [toTimeRequiredValidator, Validators.pattern(this.regExp)]),
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

  guardarConfiguracionConector(configConectoresModel: ConfigConectores) {
    this.submitted = true;
    if (this.grupoFormulario.invalid) {
      return;
    }

    this.configConectoresModel = configConectoresModel;
    this.configConectoresModel.opcion = this.opcion;
    if (this.grupoFormulario.value.conectorConfiguracionId) {
      this.configConectoresModel.conectorConfiguracionId = this.grupoFormulario.value.conectorConfiguracionId;
    }
    this.configConectoresModel.conectorConfiguracionDescripcion = this.grupoFormulario.value.conectorConfiguracionDescripcion.trim();
    this.configConectoresModel.frecuencia = this.grupoFormulario.value.frecuencia.trim();
    this.configConectoresModel.baja = !this.toggleBaja;
    this.configConectoresModel.horaDesde = this.grupoFormulario.value.horaDesde.trim();
    this.configConectoresModel.horaHasta = this.grupoFormulario.value.horaHasta.trim();
    this.configConectoresModel.urlApi = this.grupoFormulario.value.urlApi.trim();
    this.configConectoresModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;

    this.configConectoresService.guardarConfigConector(configConectoresModel, this.esEdicion).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
          this.configConectoresService.obtenerFiltros();
          this.configConectoresService.setearFiltros();
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
    const not = new NotificacionModel();
    const m = new ConfigConectores();
    m.urlApi = this.grupoFormulario.value.urlApi;
    this.generalesService.testearRutaApi(m).subscribe((res: any) => {
      switch (res.clave) {
        case 1:
          this.datosEditar.rutaExiste = true;
          not.tipo = 'success';
          not.mensaje = 'URL Exitosa';
          break;
        case 2:
          this.datosEditar.rutaExiste = false;
          not.tipo = 'error'
          not.mensaje = res.descripcion;
          break;
        case 3:
          this.datosEditar.rutaExiste = false;
          not.tipo = 'warning'
          not.mensaje = res.descripcion;
          break;
      }

      this.generalesService.notificar(not);
    },
      err => {
        this.datosEditar.rutaExiste = false;
        switch (err.status) {
          case 404:
            not.tipo = 'warning'
            not.mensaje = `La URL no existe`;
            break;
          default:
            not.tipo = 'warning'
            not.mensaje = `URL inválida`;
            break;
        }

        this.generalesService.notificar(not);
      });
  }

  get conectorConfiguracionId() {
    return this.grupoFormulario.get('conectorConfiguracionId');
  }
  get conectorConfiguracionDescripcion() {
    return this.grupoFormulario.get('conectorConfiguracionDescripcion');
  }
  get urlApi() {
    return this.grupoFormulario.get('urlApi');
  }
  get rutaExiste() {
    return this.grupoFormulario.get('rutaExiste');
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
  get frecuencia() {
    return this.grupoFormulario.get('frecuencia');
  }
  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }

  get urlHidden() {
    return this.grupoFormulario.get('urlHidden');
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

  changeRutaExisteValidation() {
    this.datosEditar.rutaExiste = "";
  }
}
