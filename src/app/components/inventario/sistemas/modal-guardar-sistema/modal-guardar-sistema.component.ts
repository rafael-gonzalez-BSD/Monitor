import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSelect } from '@angular/material';
import { GerenciaService } from '../../../../services/general/gerencia.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Sistema } from 'src/app/models/inventario/sistema';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { RespuestaModel } from '../../../../models/base/respuesta';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from '../../../../models/base/notificacion';
import { Combo } from 'src/app/models/base/combo';

@Component({
  selector: 'app-modal-guardar-sistema',
  templateUrl: './modal-guardar-sistema.component.html',
  styleUrls: ['./modal-guardar-sistema.component.scss']
})
export class ModalGuardarSistemaComponent implements OnInit {
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  insercion: boolean;
  // tslint:disable-next-line: ban-types
  datosCombo: RespuestaModel;
  grupoFormulario: FormGroup;
  sistemaModel = new Sistema();

  toggleBaja = true;
  gerenciaId = '-1';
  selectedText = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gerenciaService: GerenciaService,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService,
    private modal: MatDialog
  ) {
    this.consultarGerenciaCombo();
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.datosEditar = data;
    this.datosEditar.baja = data.insercion ? this.toggleBaja : !data.baja;
    this.gerenciaId = (data.gerenciaId).toString();
    this.insercion = data.insercion;
    
  }
  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    
  }

  validarFormulario() {
    return new FormGroup({
      SistemaId: new FormControl(),
      SistemaDescripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      Alias: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      GerenciaId: new FormControl('-1', [validarCombo]),
      Descripcion: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      Baja: new FormControl()
    });
  }

  consultarGerenciaCombo() {
    this.gerenciaService.consultarGerenciaCombo().subscribe(
      (response: any) => {
        this.datosCombo = response.datos;
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Error interno al consultar gerencia'));
      },
      () => { }
    );
  }

  selectedEstado(e: Event) {
    const source: MatSelect = e['source'];
    this.gerenciaId =  source['_value'];
    
    const id = source.selected['_element'];
    this.selectedText = id.nativeElement.outerText;    
    
  }
  
  
  get SistemaId() {
    return this.grupoFormulario.get('SistemaId');
  }
  get SistemaDescripcion() {
    return this.grupoFormulario.get('SistemaDescripcion');
  }
  get Baja() {
    return this.grupoFormulario.get('Baja');
  }
  get Alias() {
    return this.grupoFormulario.get('Alias');
  }
  get GerenciaId() {
    return this.grupoFormulario.get('GerenciaId');
  }
  get Descripcion() {
    return this.grupoFormulario.get('Descripcion');
  }

  guardarSistema(sistemaModel: Sistema) {
    this.generalesService.mostrarLoader();
    if (this.grupoFormulario.valid) {
      this.insercion ? (this.opcion = 1) : (this.opcion = 3);

      this.sistemaModel = sistemaModel;
      if (this.grupoFormulario.value.SistemaId) {
        this.sistemaModel.sistemaId = this.grupoFormulario.value.SistemaId;
      }
      this.sistemaModel.opcion = this.opcion;

      this.sistemaModel.sistemaDescripcion = this.grupoFormulario.value.SistemaDescripcion;
      this.sistemaModel.baja = !this.toggleBaja;
      this.sistemaModel.alias = this.grupoFormulario.value.Alias;
      this.sistemaModel.gerenciaId = this.grupoFormulario.value.GerenciaId;
      this.sistemaModel.descripcion = this.grupoFormulario.value.Descripcion;
      

      this.sistemaService.guardarSistema(sistemaModel, this.insercion).subscribe(
        (response: any) => {
          if (response.satisfactorio) {
            this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
            this.sistemaService.obtenerFiltros();
            this.sistemaService.setearFiltros();
            this.cerrarModal();
          } else {
            this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
          }
        },
        err => {
          this.generalesService.notificar(new NotificacionModel('success', 'Ocurrió un error'));
        },
        () => {
          this.generalesService.quitarLoader();
        }
      );
    }
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  changeMatToggle(event) {
    this.toggleBaja = event.checked;
  }

  cerrarModal() {
    this.modal.closeAll();
  }


}


// ]Validar combo

export function validarCombo (control: AbstractControl) {
  const valor: any = control.value;
  if (valor === null || valor === '-1' || valor === undefined) {
    return { requiredCombo: true }
  }
  return null;
}
