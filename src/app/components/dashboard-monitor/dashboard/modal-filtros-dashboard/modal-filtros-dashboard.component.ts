import { Component, OnInit, Inject } from '@angular/core';
import { Sistema } from 'src/app/models/inventario/sistema';
import { MatDialog, MAT_DIALOG_DATA, MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { Combo } from 'src/app/models/base/combo';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { FormGroup, FormControl } from '@angular/forms';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FiltrosDashboard } from '../../../../models/dashboard-monitor/filtrosDashboard';
import { DashboardService } from '../../../../services/dashboard-monitor/dashboard.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-modal-filtros-dashboard',
  templateUrl: './modal-filtros-dashboard.component.html',
  styleUrls: ['./modal-filtros-dashboard.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ModalFiltrosDashboardComponent implements OnInit {
  // datepicker
  date = new FormControl(moment());
  tituloModal: string;
  datosFiltros: any;
  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  filtrosDashboardModel = new FiltrosDashboard();
  opcion: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService,
    private dashboardService: DashboardService
  ) { 
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosDashboard'));
    this.datosFiltros.fecha = this.datosFiltros.fecha === null ? '' : new Date(this.datosFiltros.fecha);
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
      sistemaId: new FormControl('', [RequireMatch]),
      fecha: new FormControl()
    });
  }

  // Mostrar la descripción en el input autocomplete
  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  buscar(filtrosDashboardModel: FiltrosDashboard) {
    if (this.grupoFormulario.valid) {
      
      this.opcion=4;
      // this.generalesService.mostrarLoader();
      this.filtrosDashboardModel.opcion = this.opcion;
      if (this.grupoFormulario.value.sistemaId) {
        this.filtrosDashboardModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.filtrosDashboardModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.filtrosDashboardModel.sistemaId = 0;
        this.filtrosDashboardModel.sistemaDescripcion = '';
      }
      
      this.filtrosDashboardModel.fecha = this.date.value;
      // this.mantenimientoModel.fechaHasta = this.grupoFormulario.value.fechaHasta;

      localStorage.setItem('filtrosDashboard', JSON.stringify(this.filtrosDashboardModel));

      this.dashboardService.setearFiltros();

      // this.mantenimientoService.obtenerFiltros();

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
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el combo de sistemas. ${response.mensaje}`));
        }
      },
      err => {
        console.log(err);
        
        this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error:`));
      },
      () => { }
    );
  }

  // Obtenemos los valores del formulario
  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }
  get fecha() {
    return this.grupoFormulario.get('fecha');
  }
  

  resetForm() {
    this.grupoFormulario.reset();
  }

  cerrarModal() {
    this.modal.closeAll();
  }

  // Funciones para el manejo en el calendario de solo mes y año
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

}
