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
  datosComboSistema: RespuestaModel;
  datosComboProceso: RespuestaModel;
  sistemaCombo: Observable<Combo[]>;
  procesoCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  procesoModel = new Proceso();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private procesoService: ProcesoService,
    private sistemaService: SistemaService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosComboProceso = data.datosComboProceso;
    this.datosComboSistema = data.datosComboSistema;
  }

  ngOnInit() {
    this.grupoFormulario = this.validaFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboSistema.datos))
    );
    this.procesoCombo = this.grupoFormulario.get('procesoId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboProceso.datos))
    );

    // TODO - Integrar el seteo de los filtros si existen en el localstorage
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
    debugger;
    if (this.grupoFormulario.valid) {
      const procesoCintilla = new Proceso();
      this.procesoModel.opcion = this.opcion;
      if (this.grupoFormulario.value.procesoId) {
        this.procesoModel.procesoId = this.grupoFormulario.value.procesoId;
        const comboProceso = this.datosComboProceso['datos'];
        procesoCintilla.procesoDescripcion = comboProceso.find(
          x => x.identificador.toString() === this.procesoModel.procesoId
        ).descripcion;
      } else {
        this.procesoModel.procesoId = 0;
        procesoCintilla.procesoDescripcion = '';
      }

      if (this.grupoFormulario.value.sistemaId) {
        this.procesoModel.sistemaId = this.grupoFormulario.value.sistemaId;
        const comboSistema = this.datosComboSistema['datos'];
        procesoCintilla.sistemaDescripcion = comboSistema.find(
          x => x.identificador.toString() === this.procesoModel.sistemaId
        ).descripcion;
      } else {
        this.procesoModel.sistemaId = 0;
        procesoCintilla.sistemaDescripcion = '';
      }
      this.procesoService.setearFiltros(procesoCintilla);
      this.procesoService.obtenerFiltros(this.procesoModel);
    }
  }

  validaFormulario() {
    return new FormGroup({
      procesoId: new FormControl({}, [RequireMatch]),
      sistemaId: new FormControl({}, [RequireMatch])
    });
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (res: any) => {
        this.datosComboSistema = res;
      },
      err => {},
      () => {}
    );
  }

  consultarProcesoCombo() {
    this.procesoModel = new Proceso();
    this.procesoModel.opcion = 3;

    this.procesoService.consultarProcesoCombo(this.procesoModel).subscribe(
      (res: any) => {
        this.datosComboProceso = res;
      },
      err => {},
      () => {}
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
