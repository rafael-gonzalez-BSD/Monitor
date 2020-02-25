import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDatepicker, MatSelect } from '@angular/material';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Sistema } from 'src/app/models/inventario/sistema';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { Combo } from 'src/app/models/base/combo';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';

import moment, * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Observable } from 'rxjs';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { startWith, map } from 'rxjs/operators';
import { ExcepcionEstatus } from 'src/app/models/dashboard-monitor/excepcion-estatus';
import { ExcepcionEstatusService } from 'src/app/services/dashboard-monitor/excepcion-estatus.service';
import { debug } from 'util';
import { inputNumber } from 'src/app/extensions/custom-validator/validations';
import { dateRangeValidator } from 'src/app/extensions/picker/validate-date';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FiltrosExcepcion } from 'src/app/models/dashboard-monitor/filtros-excepcion';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';

@Component({
  selector: 'app-modal-filtro-bitacora-excepciones',
  templateUrl: './modal-filtro-bitacora-excepciones.component.html',
  styleUrls: ['./modal-filtro-bitacora-excepciones.component.scss']
})
export class ModalFiltroBitacoraExcepcionesComponent implements OnInit {
  tituloModal: string;
  grupoFormulario: FormGroup;
  datosFiltros: any;
  sistemaCombo: Observable<Combo[]>;
  datosCombo: Combo[];
  datosComboEstatus: Combo[];
  filtrosExcepcion = new FiltrosExcepcion();
  opcion: number;
  selected = 1;
  selectedText = 'Abierta';
  submitted = false;
  folio = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService,
    private dashboardService: DashboardService,
    private excepcionService: ExcepcionesService,
    private excepcionEstatusService: ExcepcionEstatusService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.tituloModal = data.tituloModal;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosExcepcion'));
    // this.datosFiltros.fechaDesde = this.datosFiltros.fechaDesde === null ? '' : new Date(this.datosFiltros.fechaDesde);
    // this.datosFiltros.fechaHasta = this.datosFiltros.fechaHasta === null ? '' : new Date(this.datosFiltros.fechaHasta);
    

    this.datosFiltros.fechaDesde = this.datosFiltros.fechaDesde === null 
    || !this.datosFiltros.fechaDesde ? '' : new Date(this.datosFiltros.fechaDesde);

    this.datosFiltros.fechaHasta = this.datosFiltros.fechaHasta === null 
    || !this.datosFiltros.fechaDesde ? '' : new Date(this.datosFiltros.fechaHasta);

    this.folio = this.datosFiltros.excepcionId === 0 ? '' : this.datosFiltros.excepcionId;
    
    this.consultarSistemaCombo();
    this.consultarExcepcionEstatusCombo();
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

  validarFormulario() {
    return new FormGroup({
      excepcionId: new FormControl('',[inputNumber(false, 3, 100)]),
      sistemaId: new FormControl('', [RequireMatch]),
      excepcionEstatusId: new FormControl(),
      fechaDesde: new FormControl(''),
      fechaHasta: new FormControl('')
    }, dateRangeValidator);
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosCombo = response.datos;
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el combo de sistemas. ${response.mensaje}`));
        }
      },
      err => {        
        this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error:`));
      },
      () => { }
    );
  }

  // Método para cachar el cambio de estado
  selectedEstado(e: Event) {
    const source: MatSelect = e['source'];
    const seleccionado = source.selected['_element'];
    this.selectedText = seleccionado.nativeElement.outerText;
  }

  // Obtenemos los valores del formulario
  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }
  get fechaDesde() {
    return this.grupoFormulario.get('fechaDesde');
  }
  get fechaHasta() {
    return this.grupoFormulario.get('fechaHasta');
  }
  get excepcionId() {
    return this.grupoFormulario.get('excepcionId');
  }
  get excepcionEstatusId() {
    return this.grupoFormulario.get('excepcionEstatusId');
  }
  

  resetForm() {
    this.grupoFormulario.reset();
  }

  cerrarModal() {
    this.modal.closeAll();
  }

  // Mostrar la descripción en el input autocomplete
  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  buscar(m: FiltrosExcepcion) {
    this.submitted = true;
    if (this.grupoFormulario.valid) {
      this.filtrosExcepcion.opcion = this.opcion;
      if (this.grupoFormulario.value.sistemaId) {
        this.filtrosExcepcion.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.filtrosExcepcion.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.filtrosExcepcion.sistemaId = 0;
        this.filtrosExcepcion.sistemaDescripcion = '';
      }
      this.filtrosExcepcion.excepcionId = this.grupoFormulario.value.excepcionId=== '' ? 0 :this.grupoFormulario.value.excepcionId;
      this.filtrosExcepcion.excepcionEstatusId = this.grupoFormulario.value.excepcionEstatusId;
      this.filtrosExcepcion.excepcionEstatusDescripcion = this.selectedText;
      
      // Validamos si alguna de las dos fechas esta vacía
      if ((this.grupoFormulario.value.fechaDesde !== '' || this.grupoFormulario.value.fechaDesde != null) &&
        (this.grupoFormulario.value.fechaHasta === '' || this.grupoFormulario.value.fechaHasta == null)) {
        this.grupoFormulario.value.fechaHasta = this.grupoFormulario.value.fechaDesde;
      }

      if ((this.grupoFormulario.value.fechaDesde === '' || this.grupoFormulario.value.fechaDesde == null) &&
        (this.grupoFormulario.value.fechaHasta !== '' || this.grupoFormulario.value.fechaHasta != null)) {
        this.grupoFormulario.value.fechaDesde = this.grupoFormulario.value.fechaHasta;
      }

      if(!(this.grupoFormulario.value.fechaDesde === null || this.grupoFormulario.value.fechaDesde === '' ) 
      && !(this.grupoFormulario.value.fechaHasta === null || this.grupoFormulario.value.fechaHasta === '')) {
        this.filtrosExcepcion.fechaDesde = moment(this.grupoFormulario.value.fechaDesde).format('YYYY/MM/DD');
        this.filtrosExcepcion.fechaHasta = moment(this.grupoFormulario.value.fechaHasta).format('YYYY/MM/DD');          
      }

      
      this.filtrosExcepcion.sistemaBaja = false;
      this.filtrosExcepcion.opcion = 4;
      localStorage.setItem('filtrosExcepcion', JSON.stringify(this.filtrosExcepcion));

      this.excepcionService.setearFiltros();
      this.excepcionService.obtenerFiltros();

      this.cerrarModal();
    }
  }

  // Función para consultar el listado de estatus para el combo estatus
  consultarExcepcionEstatusCombo() {
    const m = new ExcepcionEstatus();
    m.opcion = 3;
    this.excepcionEstatusService.consultarExcepcionEstatusCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosComboEstatus = response.datos;
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el combo de excepcionEstatus ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrio un error al consultar el combo de excepcionEstatus'));
      },
      () => { }
    );
  }

}
