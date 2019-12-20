import { NotificacionModel } from './../../../../models/base/notificacion';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteTrigger, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
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

@Component({
  selector: 'app-modal-guardar-config-excepciones',
  templateUrl: './modal-guardar-config-excepciones.component.html',
  styleUrls: ['./modal-guardar-config-excepciones.component.scss']
})
export class ModalGuardarConfigExcepcionesComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, null) auto: MatAutocompleteTrigger;
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  esEdicion: boolean;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configExcepcionesModel = new ConfigExcepciones();

  toggleBaja = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private generalesService: GeneralesService,
    private sistemaService: SistemaService,
    private configExcepcionesService: ConfigExcepcionesService,
    private modal: MatDialog
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
    this.datosEditar.baja = data.edit ? !data.baja : true;
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
      frecuencia: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      rutaLog: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      horaDesde: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      horaHasta: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      sistemaId: new FormControl('', [Validators.required, RequireMatch]),
      baja: new FormControl()
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

  guardarConfiguracionExcepcion(configExcepcionesModel: ConfigExcepciones) {
    debugger
    this.generalesService.mostrarLoader();
    if (this.grupoFormulario.valid) {
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
  }

  testearRuta() {
    this.configExcepcionesModel = this.grupoFormulario.value;
    this.generalesService.testearRuta(this.configExcepcionesModel).subscribe((res: any) => {
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
    return this.grupoFormulario.get('rutaLog');
  }
  get baja() {
    return this.grupoFormulario.get('horaHasta');
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

}
