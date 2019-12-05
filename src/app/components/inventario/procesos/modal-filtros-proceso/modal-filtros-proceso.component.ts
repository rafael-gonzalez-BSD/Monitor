import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Proceso } from '../../../../models/inventario/proceso';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SistemaService } from '../../../../services/inventario/sistema.service';

@Component({
  selector: 'app-modal-filtros-proceso',
  templateUrl: './modal-filtros-proceso.component.html',
  styleUrls: ['./modal-filtros-proceso.component.scss']
})
export class ModalFiltrosProcesoComponent implements OnInit {
  dataSource: Object[] = [];
  tituloModal: string;
  opcion: number;
  datosComboSistema: Object[] = [];
  datosComboProceso: Object[] = [];
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
  }

  ngOnInit() {
    this.grupoFormulario = this.validaFormulario();
    this.consultarProcesoCombo();
    this.consultarSistemaCombo();
  }

  buscar(procesoModel: Proceso) {
    if (this.grupoFormulario.valid) {
      this.procesoModel = procesoModel;
      this.procesoModel.opcion = this.opcion;
      if (this.grupoFormulario.value.procesoId) {
        this.procesoModel.procesoId = this.grupoFormulario.value.procesoId;
      } else {
        this.procesoModel.procesoId = 0;
      }

      if (this.grupoFormulario.value.sistemaId) {
        this.procesoModel.sistemaId = this.grupoFormulario.value.sistemaId;
      } else {
        this.procesoModel.sistemaId = 0;
      }

      this.procesoService.obtenerFiltros(this.procesoModel);

      // this.procesoService.obtenerProcesos(procesoModel).subscribe((res: any) => {
      //   this.dataSource = res.datos;
      //   console.log('Lista Filtrada', res.datos);
      // });
    }
  }

  validaFormulario() {
    return new FormGroup({
      procesoId: new FormControl(),
      sistemaId: new FormControl()
    });
  }

  consultarSistemaCombo() {
    this.sistemaService.consultarSistemaCombo().subscribe(
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

  cerrarModal() {
    this.modal.closeAll();
  }
}
