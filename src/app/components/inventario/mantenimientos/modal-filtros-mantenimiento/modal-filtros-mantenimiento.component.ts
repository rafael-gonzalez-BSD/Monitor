import { Component, OnInit, Inject } from '@angular/core';
import { Sistema } from 'src/app/models/inventario/sistema';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Combo } from 'src/app/models/base/combo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { dateRangeValidator } from '../../../../extensions/picker/validate-date';



@Component({
  selector: 'app-modal-filtros-mantenimiento',
  templateUrl: './modal-filtros-mantenimiento.component.html',
  styleUrls: ['./modal-filtros-mantenimiento.component.scss']
})
export class ModalFiltrosMantenimientoComponent implements OnInit {
  tituloModal: string;
  opcion: number;
  datosEditar: any;
  datosCombo: Combo[];
  grupoFormulario: FormGroup;
  sistemaCombo: Observable<Combo[]>;
  mantenimientoModel = new Mantenimiento();

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private mantenimientoService: MantenimientoService,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = this.data.opcion;
    this.datosEditar = data;
    this.datosEditar.fechaDesde = this.datosEditar.fechaDesde === '' ? '' : new Date(this.datosEditar.fechaDesde);
    this.datosEditar.fechaHasta = this.datosEditar.fechaHasta === '' ? '' : new Date(this.datosEditar.fechaHasta);
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

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosCombo = response.datos;

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el combo de sistemas. ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrio un error.'));
      },
      () => { }
    );
  }

  validarFormulario() {
    return new FormGroup({
      sistemaId: new FormControl('', [RequireMatch]),
      fechaDesde: new FormControl(''),
      fechaHasta: new FormControl('')
    }, dateRangeValidator);
  }

  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  buscar(mantenimientoModel: Mantenimiento) {
    if (this.grupoFormulario.valid) {
      this.generalesService.mostrarLoader();
      this.mantenimientoModel.opcion = this.opcion;
      if (this.grupoFormulario.value.sistemaId) {
        this.mantenimientoModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.mantenimientoModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.mantenimientoModel.sistemaId = 0;
        this.mantenimientoModel.sistemaDescripcion = '';
      }
      this.mantenimientoModel.fechaDesde = this.grupoFormulario.value.fechaDesde;
      this.mantenimientoModel.fechaHasta = this.grupoFormulario.value.fechaHasta;

      localStorage.setItem('filtrosMantenimientos', JSON.stringify(this.mantenimientoModel));

      this.mantenimientoService.setearFiltros();

      this.mantenimientoService.obtenerFiltros();

      this.cerrarModal();
    }
  }

  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }

  get fechaDesde() {
    return this.grupoFormulario.get('fechaDesde');
  }

  get fechaHasta() {
    return this.grupoFormulario.get('fechaHasta');
  }

  resetForm() {
    this.grupoFormulario.reset();
  }

  cerrarModal() {
    this.modal.closeAll();
  }
}
