import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Proceso } from '../../../../models/inventario/proceso';
import { MatDialog, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from '../../../../models/base/respuesta';
import { Observable } from 'rxjs';
import { Combo } from '../../../../models/base/combo';
import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from '../../../../extensions/autocomplete/require-match';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-modal-filtros-proceso',
  templateUrl: './modal-filtros-proceso.component.html',
  styleUrls: ['./modal-filtros-proceso.component.scss']
})
export class ModalFiltrosProcesoComponent implements OnInit {
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
  procesoModel = new Proceso();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private procesoService: ProcesoService,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosProcesos'));
    this.consultarSistemaCombo();
    // this.consultarProcesoCombo();
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

  buscar(procesoModel: Proceso) {
    this.generalesService.mostrarLoader();
    if (this.grupoFormulario.valid) {
      this.procesoModel.opcion = this.opcion;
      if (this.grupoFormulario.value.procesoId) {
        this.procesoModel.procesoId = this.grupoFormulario.value.procesoId.identificador;
        this.procesoModel.procesoDescripcion = this.grupoFormulario.value.procesoId.descripcion;
      } else {
        this.procesoModel.procesoId = 0;
        this.procesoModel.procesoDescripcion = '';
      }

      if (this.grupoFormulario.value.sistemaId) {
        this.procesoModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.procesoModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.procesoModel.sistemaId = 0;
        this.procesoModel.sistemaDescripcion = '';
      }

      localStorage.setItem('filtrosProcesos', JSON.stringify(this.procesoModel));

      this.procesoService.setearFiltros();

      this.procesoService.obtenerFiltros();

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
