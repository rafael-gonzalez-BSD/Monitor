import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteTrigger, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';
import { ConfigConectoresService } from 'src/app/services/configuracion/config-conectores.service';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { startWith, map } from 'rxjs/operators';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';

@Component({
  selector: 'app-modal-filtros-config-conectores',
  templateUrl: './modal-filtros-config-conectores.component.html',
  styleUrls: ['./modal-filtros-config-conectores.component.scss']
})
export class ModalFiltrosConfigConectoresComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, null) autoSistema: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger, null) autoConector: MatAutocompleteTrigger;
  tituloModal: string;
  opcion: number;
  datosFiltros: any;
  datosComboSistema: Combo[];
  datosComboConector: Combo[];
  sistemaCombo: Observable<Combo[]>;
  conectorCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configConectoresModel = new ConfigConectores();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private configConectoresService: ConfigConectoresService,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosConfigConectores'));
    this.consultarSistemaCombo();
    this.consultarConectorCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validaFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboSistema))
    );
    this.conectorCombo = this.grupoFormulario.get('conectorConfiguracionId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboConector))
    );

    if (this.datosFiltros.sistemaId > 0) {
      this.setearValorAutocomplete('sistemaId', this.datosFiltros.sistemaId, this.datosFiltros.sistemaDescripcion);
    }

    if (this.datosFiltros.procesoId > 0) {
      this.setearValorAutocomplete(
        'conectorConfiguracionId',
        this.datosFiltros.conectorConfiguracionId,
        this.datosFiltros.conectorConfiguracionDescripcion);
    }
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

  buscar(configConectoresModel: ConfigConectores) {
    this.generalesService.mostrarLoader();
    if (this.grupoFormulario.valid) {
      this.configConectoresModel.opcion = this.opcion;
      if (this.grupoFormulario.value.conectorConfiguracionId) {
        this.configConectoresModel.conectorConfiguracionId = this.grupoFormulario.value.conectorConfiguracionId.identificador;
        this.configConectoresModel.conectorConfiguracionDescripcion = this.grupoFormulario.value.conectorConfiguracionId.descripcion;
      } else {
        this.configConectoresModel.conectorConfiguracionId = 0;
        this.configConectoresModel.conectorConfiguracionDescripcion = '';
      }

      if (this.grupoFormulario.value.sistemaId) {
        this.configConectoresModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.configConectoresModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.configConectoresModel.sistemaId = 0;
        this.configConectoresModel.sistemaDescripcion = '';
      }

      localStorage.setItem('filtrosConfigConectores', JSON.stringify(this.configConectoresModel));

      this.configConectoresService.setearFiltros();

      this.configConectoresService.obtenerFiltros();

      this.cerrarModal();
    }
  }

  validaFormulario() {
    return new FormGroup({
      conectorConfiguracionId: new FormControl('', [RequireMatch]),
      sistemaId: new FormControl('', [RequireMatch])
    });
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.datosComboSistema = res.datos;
        }
        else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al cargar el combo sistema.'));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error.'));
      },
      () => { }
    );
  }

  consultarConectorCombo() {
    const m = new ConfigConectores();
    m.opcion = 3;
    m.baja = false;
    this.configConectoresService.consultarConectorCombo(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.datosComboConector = res.datos;
        }
        else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al cargar el combo conector.'));
        }

      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error.'));
      },
      () => { }
    );
  }

  get conectorConfiguracionId() {
    return this.grupoFormulario.get('conectorConfiguracionId');
  }
  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  cerrarModal() {
    this.modal.closeAll();
  }

}
