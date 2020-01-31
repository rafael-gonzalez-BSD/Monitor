import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDatepicker } from '@angular/material';
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

@Component({
  selector: 'app-modal-filtro-bitacora-excepciones',
  templateUrl: './modal-filtro-bitacora-excepciones.component.html',
  styleUrls: ['./modal-filtro-bitacora-excepciones.component.scss']
})
export class ModalFiltroBitacoraExcepcionesComponent implements OnInit {
  date: any;
  tituloModal: string;
  grupoFormulario: FormGroup;
  datosFiltros: any;
  sistemaCombo: Observable<Combo[]>;
  datosCombo: Combo[];
  filtrosDashboardModel = new FiltrosDashboard();
  opcion: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService,
    private dashboardService: DashboardService
  ) {
    this.tituloModal = data.tituloModal;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosDashboard'));
    const cadena  = this.datosFiltros.fechaDesdeCorta.split('/');
    const fecha = new Date(`${cadena[1]}/${cadena[0]}/01`);
    this.date =  new FormControl(moment(fecha));
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
      fechaDesde: new FormControl()
    });
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

  // Mostrar la descripción en el input autocomplete
  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  buscar(filtrosDashboardModel: FiltrosDashboard) {
    if (this.grupoFormulario.valid) {
      
      this.opcion = 5;
      // this.generalesService.mostrarLoader();
      this.filtrosDashboardModel.opcion = this.opcion;
      if (this.grupoFormulario.value.sistemaId) {
        this.filtrosDashboardModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.filtrosDashboardModel.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.filtrosDashboardModel.sistemaId = 0;
        this.filtrosDashboardModel.sistemaDescripcion = '';
      }
      
      this.filtrosDashboardModel.fechaDesde = this.date.value;      
      this.filtrosDashboardModel.fechaDesdeCorta = moment(this.date.value).format('MM/YYYY');
      localStorage.setItem('filtrosDashboard', JSON.stringify(this.filtrosDashboardModel));

      this.dashboardService.setearFiltros();
      this.dashboardService.obtenerFiltros();
      this.cerrarModal();
    }
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
