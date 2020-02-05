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
import { BreakpointObserver } from '@angular/cdk/layout';



@Component({
  selector: 'app-modal-filtros-mantenimiento',
  templateUrl: './modal-filtros-mantenimiento.component.html',
  styleUrls: ['./modal-filtros-mantenimiento.component.scss']
})
export class ModalFiltrosMantenimientoComponent implements OnInit {
  submitted = false;
  tituloModal: string;
  opcion: number;
  datosFiltros: any;
  datosCombo: Combo[];
  grupoFormulario: FormGroup;
  sistemaCombo: Observable<Combo[]>;
  mantenimientoModel = new Mantenimiento();

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private sistemaService: SistemaService,
    private mantenimientoService: MantenimientoService,
    private generalesService: GeneralesService
  ) {
    this.tituloModal = data.tituloModal;
    this.opcion = this.data.opcion;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosMantenimientos'));
    this.datosFiltros.fechaDesde = this.datosFiltros.fechaDesde === null ? '' : new Date(this.datosFiltros.fechaDesde);
    this.datosFiltros.fechaHasta = this.datosFiltros.fechaHasta === null ? '' : new Date(this.datosFiltros.fechaHasta);

    this.consultarSistemaCombo();
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosCombo))
    );

    if (this.datosFiltros.sistemaId > 0) {
      this.setearValorAutocomplete('sistemaId', this.datosFiltros.sistemaId, this.datosFiltros.sistemaDescripcion);
    }
  }

  get isMobile() {
    return this.breakpointObserver.isMatched('(max-width: 823px)');
  }

  setearValorAutocomplete(campo: string, id: number, desc: string) {
    this.grupoFormulario.get(campo).setValue({
      identificador: id,
      descripcion: desc
    });
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
    this.submitted = true;
    if (this.grupoFormulario.invalid) {
      return;
    }

    this.mantenimientoModel.opcion = this.opcion;
    if (this.grupoFormulario.value.sistemaId) {
      this.mantenimientoModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
      this.mantenimientoModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
    } else {
      this.mantenimientoModel.sistemaId = 0;
      this.mantenimientoModel.sistemaDescripcion = '';
    }

    if ((this.grupoFormulario.value.fechaDesde != '' || this.grupoFormulario.value.fechaDesde != null) &&
      (this.grupoFormulario.value.fechaHasta == '' || this.grupoFormulario.value.fechaHasta == null)) {
      this.grupoFormulario.value.fechaHasta = this.grupoFormulario.value.fechaDesde;
    }

    if ((this.grupoFormulario.value.fechaDesde == '' || this.grupoFormulario.value.fechaDesde == null) &&
      (this.grupoFormulario.value.fechaHasta != '' || this.grupoFormulario.value.fechaHasta != null)) {
      this.grupoFormulario.value.fechaDesde = this.grupoFormulario.value.fechaHasta;
    }

    this.mantenimientoModel.fechaDesde = this.grupoFormulario.value.fechaDesde || null;
    this.mantenimientoModel.fechaHasta = this.grupoFormulario.value.fechaHasta || null;

    this.mantenimientoModel.sistemaBaja = false;

    localStorage.setItem('filtrosMantenimientos', JSON.stringify(this.mantenimientoModel));

    this.mantenimientoService.setearFiltros();

    this.mantenimientoService.obtenerFiltros();

    this.cerrarModal();
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
