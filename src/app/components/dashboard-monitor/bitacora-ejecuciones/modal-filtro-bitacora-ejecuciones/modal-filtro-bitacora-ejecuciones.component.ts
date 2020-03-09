import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';
import { ExcepcionEstatusService } from 'src/app/services/dashboard-monitor/excepcion-estatus.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Combo } from 'src/app/models/base/combo';
import { FiltrosEjecucion } from 'src/app/models/dashboard-monitor/filtros-ejecucion';
import { Sistema } from 'src/app/models/inventario/sistema';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { Proceso } from 'src/app/models/inventario/proceso';
import { ProcesoService } from 'src/app/services/inventario/proceso.service';
import { startWith, map } from 'rxjs/operators';
import { dateRangeValidator } from 'src/app/extensions/picker/validate-date';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import moment from 'moment';
import { EjecucionesService } from 'src/app/services/dashboard-monitor/ejecuciones.service';
import { debug } from 'util';

@Component({
  selector: 'app-modal-filtro-bitacora-ejecuciones',
  templateUrl: './modal-filtro-bitacora-ejecuciones.component.html',
  styleUrls: ['./modal-filtro-bitacora-ejecuciones.component.scss']
})
export class ModalFiltroBitacoraEjecucionesComponent implements OnInit {
  tituloModal: string;
  grupoFormulario: FormGroup;
  datosFiltros: any;

  sistemaCombo: Observable<Combo[]>;
  procesoCombo: Observable<Combo[]>;
  datosComboSistema: Combo[];
  datosComboProceso: Combo[];

  datosComboEstatus: Combo[];
  filtrosEjecucion = new FiltrosEjecucion();
  opcion: number;
  selected = 1;
  selectedText = 'Abierta';
  submitted = false;
  folio = '';
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private procesoService: ProcesoService,
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver,
    private ejecucionService: EjecucionesService
  ) {
    this.tituloModal = data.tituloModal;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosEjecucion'));
    
    this.datosFiltros.fechaDesde = this.datosFiltros.fechaDesde === null 
    || !this.datosFiltros.fechaDesde ? '' : new Date(this.datosFiltros.fechaDesde);

    this.datosFiltros.fechaHasta = this.datosFiltros.fechaHasta === null 
    || !this.datosFiltros.fechaDesde ? '' : new Date(this.datosFiltros.fechaHasta);
    
    this.consultarSistemaCombo();
    if (this.datosFiltros.sistemaId > 0) {
      const m = new Combo();
      m.identificador = this.datosFiltros.sistemaId;
      m.descripcion = this.datosFiltros.sistemaDescripcion;
      this.consultarProcesoCombo(m);
    }else{
      const m = new Combo();
      m.identificador = -1;
      m.descripcion = '';   
      this.consultarProcesoCombo(m);   
    }
   }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboSistema))
    );
    
    if (this.datosFiltros.sistemaId > 0) {
      this.setearValorAutocomplete('sistemaId', this.datosFiltros.sistemaId, this.datosFiltros.sistemaDescripcion);
    }

    this.procesoCombo = this.grupoFormulario.get('procesoId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboProceso))
    );

    if (this.datosFiltros.procesoId > 0) {
      this.setearValorAutocomplete('procesoId', this.datosFiltros.procesoId, this.datosFiltros.procesoDescripcion);
    }
    
  }

  filter(valor: string, datosCombo: Combo[]) {
    if (valor.length < 4) return [];
    const filterName = valor.toLowerCase();
    return datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName));
  }

  validarFormulario() {
    return new FormGroup({
      sistemaId: new FormControl('', [RequireMatch]),
      procesoId: new FormControl('', [RequireMatch]),
      fechaDesde: new FormControl(''),
      fechaHasta: new FormControl('')
    }, dateRangeValidator);
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosComboSistema = response.datos;
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

  buscar(m: FiltrosEjecucion) {
    this.submitted = true;
    if (this.grupoFormulario.valid) {
      if (this.grupoFormulario.value.sistemaId) {
        this.filtrosEjecucion.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.filtrosEjecucion.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.filtrosEjecucion.sistemaId = 0;
        this.filtrosEjecucion.sistemaDescripcion = '';
      } 

      if (this.grupoFormulario.value.procesoId) {
        this.filtrosEjecucion.procesoId = this.grupoFormulario.value.procesoId.identificador;
        this.filtrosEjecucion.procesoDescripcion = this.grupoFormulario.value.procesoId.descripcion;
      } else {
        this.filtrosEjecucion.procesoId = 0;
        this.filtrosEjecucion.procesoDescripcion = '';
      } 
      
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
        this.filtrosEjecucion.fechaDesde = moment(this.grupoFormulario.value.fechaDesde).format('YYYY/MM/DD');
        this.filtrosEjecucion.fechaHasta = moment(this.grupoFormulario.value.fechaHasta).format('YYYY/MM/DD');          
      }
      this.filtrosEjecucion.sistemaBaja = false;
      this.filtrosEjecucion.procesoBaja = false;
      this.filtrosEjecucion.opcion = 4;
      localStorage.setItem('filtrosEjecucion', JSON.stringify(this.filtrosEjecucion));

      this.ejecucionService.setearFiltros();
      this.ejecucionService.obtenerFiltros();

      console.log(this.filtrosEjecucion)

      this.cerrarModal();
    }
  }

  consultarProcesoCombo(value: Combo) {
    const m = new Proceso();
    m.opcion = 3;
    m.sistemaId = value.identificador;
    m.baja = false;
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

  setearValorAutocomplete(campo: string, id: number, desc: string) {
    this.grupoFormulario.get(campo).setValue({
      identificador: id,
      descripcion: desc
    });
  }

  // Mostrar la descripción en el input autocomplete
  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  get isMobile() {
    return this.breakpointObserver.isMatched('(max-width: 823px)');
  }
  // Obtenemos los valores del formulario
  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }
  get procesoId() {
    return this.grupoFormulario.get('procesoId');
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
