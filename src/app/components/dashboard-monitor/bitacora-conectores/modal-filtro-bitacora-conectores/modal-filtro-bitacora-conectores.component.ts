import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FiltrosConector } from 'src/app/models/dashboard-monitor/filtros-conector';
import { Combo } from 'src/app/models/base/combo';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConectoresService } from 'src/app/services/dashboard-monitor/conectores.service';
import { Sistema } from 'src/app/models/inventario/sistema';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { dateRangeValidator } from 'src/app/extensions/picker/validate-date';
import { startWith, map } from 'rxjs/operators';
import { ConfigConectoresService } from 'src/app/services/configuracion/config-conectores.service';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import moment from 'moment';

@Component({
  selector: 'app-modal-filtro-bitacora-conectores',
  templateUrl: './modal-filtro-bitacora-conectores.component.html',
  styleUrls: ['./modal-filtro-bitacora-conectores.component.scss']
})
export class ModalFiltroBitacoraConectoresComponent implements OnInit {
  tituloModal: string;
  grupoFormulario: FormGroup;
  datosFiltros: any;

  sistemaCombo: Observable<Combo[]>;
  configConectorCombo: Observable<Combo[]>;
  datosComboSistema: Combo[];
  datosComboConfigConector: Combo[];

  datosComboEstatus: Combo[];
  filtrosConector = new FiltrosConector();
  opcion: number;
  selected = 1;
  selectedText = 'Abierta';
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private modal: MatDialog,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver,
    private conectorService: ConectoresService,
    private configConectoresService: ConfigConectoresService
  ) {
    this.tituloModal = data.tituloModal;
    this.datosFiltros = JSON.parse(localStorage.getItem('filtrosConector'));
    this.datosFiltros.fechaDesde = this.datosFiltros.fechaDesde === null ? '' : new Date(this.datosFiltros.fechaDesde);
    this.datosFiltros.fechaHasta = this.datosFiltros.fechaHasta === null ? '' : new Date(this.datosFiltros.fechaHasta);
    
    this.consultarSistemaCombo();
    if (this.datosFiltros.sistemaId > 0) {
      const m = new Combo();
      m.identificador = this.datosFiltros.sistemaId;
      // m.descripcion = this.datosFiltros.sistemaDescripcion;
      this.consultarConfigconectorCombo(m);
    }else{
      const m = new Combo();
      m.identificador = -1;
      m.descripcion = '';   
      this.consultarConfigconectorCombo(m);   
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

    this.configConectorCombo = this.grupoFormulario.get('conectorConfiguracionId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosComboConfigConector))
    );

    if (this.datosFiltros.conectorConfiguracionId > 0) {
      // tslint:disable-next-line: max-line-length
      this.setearValorAutocomplete('conectorConfiguracionId', this.datosFiltros.conectorConfiguracionId, this.datosFiltros.conectorConfiguracionDescripcion);
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
      conectorConfiguracionId: new FormControl('', [RequireMatch]),
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

  consultarConfigconectorCombo(value: Combo) {
    const m = new ConfigConectores();
    m.opcion = 3;
    m.sistemaId = value.identificador;
    m.baja = false;
    this.configConectoresService.consultarConectorCombo(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.datosComboConfigConector = res.datos;
        }
        else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al cargar el combo de configuración de conectores'));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error'));
      },
      () => { }
    );
  }

  buscar(m: FiltrosConector) {
    this.submitted = true;
    if (this.grupoFormulario.valid) {
      if (this.grupoFormulario.value.sistemaId) {
        this.filtrosConector.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
        this.filtrosConector.sistemaDescripcion = this.grupoFormulario.value.sistemaId.descripcion;
      } else {
        this.filtrosConector.sistemaId = 0;
        this.filtrosConector.sistemaDescripcion = '';
      } 

      if (this.grupoFormulario.value.conectorConfiguracionId) {
        this.filtrosConector.conectorConfiguracionId = this.grupoFormulario.value.procesoId.identificador;
        this.filtrosConector.conectorConfiguracionDescripcion = this.grupoFormulario.value.procesoId.descripcion;
      } else {
        this.filtrosConector.conectorConfiguracionId = 0;
        this.filtrosConector.conectorConfiguracionDescripcion = '';
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
      
      this.filtrosConector.fechaDesde = moment(this.grupoFormulario.value.fechaDesde).format('YYYY/MM/DD');
      this.filtrosConector.fechaHasta = moment(this.grupoFormulario.value.fechaHasta).format('YYYY/MM/DD');
      this.filtrosConector.baja = false;
      this.filtrosConector.opcion = 4;
      localStorage.setItem('filtrosConector', JSON.stringify(this.filtrosConector));

      this.conectorService.setearFiltros();
      this.conectorService.obtenerFiltros();

      this.cerrarModal();
    }
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
  get conectorConfiguracionId() {
    return this.grupoFormulario.get('conectorConfiguracionId');
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
