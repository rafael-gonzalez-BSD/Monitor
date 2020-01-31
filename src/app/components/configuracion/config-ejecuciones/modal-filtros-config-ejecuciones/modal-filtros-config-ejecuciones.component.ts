import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteTrigger, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigEjecuciones } from '../../../../models/configuracion/config-ejecuciones';
import { ProcesoService } from '../../../../services/inventario/proceso.service';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { GeneralesService } from '../../../../services/general/generales.service';
import { startWith, map } from 'rxjs/operators';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { Proceso } from 'src/app/models/inventario/proceso';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { ConfigEjecucionesService } from '../../../../services/configuracion/config-ejecuciones.service';

@Component({
  selector: 'app-modal-filtros-config-ejecuciones',
  templateUrl: './modal-filtros-config-ejecuciones.component.html',
  styleUrls: ['./modal-filtros-config-ejecuciones.component.scss']
})
export class ModalFiltrosConfigEjecucionesComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, null) autoSistema: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger, null) autoProceso: MatAutocompleteTrigger;
  tituloModal: string;
  opcion: number;
  datosFiltros: any;
  datosComboSistema: Combo[];
  datosComboProceso: Combo[];
  sistemaCombo: Observable<Combo[]>;
  procesoCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configEjecucionesModel = new ConfigEjecuciones();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private configEjecucionesService: ConfigEjecucionesService,
    private procesoService: ProcesoService,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosConfigEjecuciones'));
    this.consultarSistemaCombo();
    if (this.datosFiltros.sistemaId > 0) {
      const m = new Combo();
      m.identificador = this.datosFiltros.sistemaId;
      m.descripcion = this.datosFiltros.sistemaDescripcion;
      this.consultarProcesoCombo(m);
    }
  }

  ngOnInit() {
    this.grupoFormulario = this.validaFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboSistema))
    );
    this.procesoCombo = this.grupoFormulario.get('procesoId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboProceso))
    );

    if (this.datosFiltros.sistemaId > 0) {
      this.setearValorAutocomplete('sistemaId', this.datosFiltros.sistemaId, this.datosFiltros.sistemaDescripcion);
    }

    if (this.datosFiltros.procesoId > 0) {
      this.setearValorAutocomplete('procesoId', this.datosFiltros.procesoId, this.datosFiltros.procesoDescripcion);
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

  buscar(configEjecucionesModel: ConfigEjecuciones) {
    if (this.grupoFormulario.valid) {
      this.configEjecucionesModel.opcion = this.opcion;
      if (this.grupoFormulario.value.procesoId) {
        this.configEjecucionesModel.procesoId = this.grupoFormulario.value.procesoId.identificador;
        this.configEjecucionesModel.procesoDescripcion = this.grupoFormulario.value.procesoId.descripcion;
      } else {
        this.configEjecucionesModel.procesoId = 0;
        this.configEjecucionesModel.procesoDescripcion = '';
      }

      if (this.grupoFormulario.value.sistemaId) {
        this.configEjecucionesModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.configEjecucionesModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.configEjecucionesModel.sistemaId = 0;
        this.configEjecucionesModel.sistemaDescripcion = '';
      }

      localStorage.setItem('filtrosConfigEjecuciones', JSON.stringify(this.configEjecucionesModel));

      this.configEjecucionesService.setearFiltros();

      this.configEjecucionesService.obtenerFiltros();

      this.cerrarModal();
    }
  }

  validaFormulario() {
    return new FormGroup({
      procesoId: new FormControl('', [RequireMatch]),
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

  consultarProcesoCombo(value: Combo) {
    const m = new Proceso();
    m.opcion = 3;
    m.sistemaId = value.identificador;
    m.baja = false;
    this.procesoService.consultarProcesoCombo(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.datosComboProceso = res.datos;
        }
        else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al cargar el combo proceso.'));
        }

      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error.'));
      },
      () => { }
    );
  }

  get procesoId() {
    return this.grupoFormulario.get('procesoId');
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
