import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSelect } from '@angular/material';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Sistema } from '../../../../models/inventario/sistema';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Combo } from 'src/app/models/base/combo';
import { RespuestaModel } from '../../../../models/base/respuesta';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-modal-filtros-sistema',
  templateUrl: './modal-filtros-sistema.component.html',
  styleUrls: ['./modal-filtros-sistema.component.scss']
})
export class ModalFiltrosSistemaComponent implements OnInit {
  tituloModal: string;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  sistemaModel = new Sistema();
  opcion: number;
  selected = '-1';
  selectedText = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService) {
    this.tituloModal = data.tituloModal;
    this.opcion = data.opcion;
    this.consultarSistemaCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosCombo))
    );
  }

  filter(valor: string, datosCombo: Combo[]) {
    if (valor.length < 4) return [];
    const filterName = valor.toLowerCase();
    return datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName));
  }

  validarFormulario() {
    return new FormGroup({
      sistemaId: new FormControl('', [RequireMatch]),
      baja: new FormControl()
    });
  }

  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  selectedEstado(e: Event) {
    const source: MatSelect = e['source'];
    const seleccionado = source.selected['_element'];
    this.selectedText = seleccionado.nativeElement.outerText;
  }

  buscar(sistemaModel: Sistema) {
    if (this.grupoFormulario.valid) {
      this.sistemaModel.opcion = this.opcion;
      if (this.grupoFormulario.value.sistemaId) {
        this.sistemaModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.sistemaModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.sistemaModel.sistemaId = 0;
        this.sistemaModel.sistemaDescripcion = '';
      }

      if (this.grupoFormulario.value.baja) {
        if (this.grupoFormulario.value.baja !== '-1') {
          this.sistemaModel.baja = this.grupoFormulario.value.baja;
          this.sistemaModel.bajaDescripcion = this.selectedText;
        } else {
          this.sistemaModel.baja = null;
          this.sistemaModel.bajaDescripcion = 'Ambos';
        }
      } else {
        this.sistemaModel.baja = null;
        this.sistemaModel.bajaDescripcion = 'Ambos';
      }

      localStorage.setItem('filtrosSistemas', JSON.stringify(this.sistemaModel));

      this.sistemaService.setearFiltros();

      this.sistemaService.obtenerFiltros();

      this.cerrarModal();
    }
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosCombo = response.datos;
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al consultar el combo de sistemas.' + response.mensaje));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrio un error.'));
      },
      () => { }
    );
  }

  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }
  get baja() {
    return this.grupoFormulario.get('baja');
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  cerrarModal() {
    this.modal.closeAll();
  }
}
