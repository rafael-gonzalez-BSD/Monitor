import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteTrigger, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { GeneralesService } from '../../../../services/general/generales.service';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { RequireMatch } from '../../../../extensions/autocomplete/require-match';
import { ConfigExcepciones } from '../../../../models/configuracion/config-excepciones';
import { startWith, map } from 'rxjs/operators';
import { ConfigExcepcionesService } from '../../../../services/configuracion/config-excepciones.service';

@Component({
  selector: 'app-modal-filtros-config-excepciones',
  templateUrl: './modal-filtros-config-excepciones.component.html',
  styleUrls: ['./modal-filtros-config-excepciones.component.scss']
})
export class ModalFiltrosConfigExcepcionesComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, null) auto: MatAutocompleteTrigger;
  tituloModal: string;
  opcion: number;
  datosFiltros: any;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  configExcepcionesModel = new ConfigExcepciones();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private configExcepcionesService: ConfigExcepcionesService,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosConfigExcepciones'));
    this.consultarSistemaCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validaFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosCombo))
    );

    if (this.datosFiltros.sistemaId > 0) {
      this.setearValorAutocomplete('sistemaId', this.datosFiltros.sistemaId, this.datosFiltros.sistemaDescripcion);
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

  validaFormulario() {
    return new FormGroup({
      sistemaId: new FormControl('', [RequireMatch])
    });
  }

  buscar(configExcepcionesModel: ConfigExcepciones) {
    if (this.grupoFormulario.valid) {
      this.configExcepcionesModel.opcion = this.opcion;

      if (this.grupoFormulario.value.sistemaId) {
        this.configExcepcionesModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.configExcepcionesModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.configExcepcionesModel.sistemaId = 0;
        this.configExcepcionesModel.sistemaDescripcion = '';
      }

      localStorage.setItem('filtrosConfigExcepciones', JSON.stringify(this.configExcepcionesModel));

      this.configExcepcionesService.setearFiltros();

      this.configExcepcionesService.obtenerFiltros();

      this.cerrarModal();
    }
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.datosCombo = res.datos;
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
