import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfigEjecucionesService } from '../../../../services/configuracion/config-ejecuciones.service';
import { ModalGuardarConfigEjecucionesComponent } from '../modal-guardar-config-ejecuciones/modal-guardar-config-ejecuciones.component';
import { MatDialogConfig, MatTableDataSource, PageEvent, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { ConfigEjecuciones } from 'src/app/models/configuracion/config-ejecuciones';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { getConfigDataTable } from 'src/app/extensions/dataTable/dataTable';

@Component({
  selector: 'app-grilla-config-ejecuciones',
  templateUrl: './grilla-config-ejecuciones.component.html',
  styleUrls: ['./grilla-config-ejecuciones.component.scss']
})
export class GrillaConfigEjecucionesComponent implements AfterViewInit, OnDestroy, OnInit {
  // DataTable
  dtOptions: any = {};
  config: ConfigEjecuciones[] = [];
  dtTrigger: Subject<ConfigEjecuciones> = new Subject();
  paginar = false;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;


  tableColumns: string[] = ['accion', 'sistema', 'proceso', 'frecuencia', 'rutaLog', 'horario', 'ventanaMantenimiento', 'tiempoEstimadoEjecucion', 'tiempoOptimoEjecucion', 'estado'];
  dataSource: MatTableDataSource<ConfigEjecuciones>;
  configEjecucionesModel = new ConfigEjecuciones();
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  pageEvent: PageEvent;
  noData: Observable<boolean>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private generalesService: GeneralesService,
    private configEjecucionesService: ConfigEjecucionesService,
    private modal: MatDialog
  ) { }

  ngOnInit() {

    this.dtOptions = getConfigDataTable();

    console.log(this.dtOptions)

    this.configEjecucionesService.filtros.subscribe((m: any) => {
      this.obtenerConfigEjecuciones(m);
    });
    this.configEjecucionesService.obtenerFiltros();
    this.configEjecucionesService.setearFiltros();
  }

  ngAfterViewInit(){

    
      this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  obtenerConfigEjecuciones(m: ConfigEjecuciones) {
    this.generalesService.mostrarLoader();
    this.configEjecucionesService.obtenerConfigEjecuciones(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          console.log(res.datos);         

          this.config = res.datos;
          

          this.dataSource = new MatTableDataSource(res.datos);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.length = res.datos.length;

          // Validamos si debemos paginar o no
          // tslint:disable-next-line: radix
          const tamanioPaginar = parseInt(localStorage.getItem('tamanioPaginar'));
          if(this.length > tamanioPaginar) 
          {
            this.dtOptions.paging = true;
            this.dtOptions.info = true;
          }          
          this.rerender();

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el listado de configuraciones de ejecuciones. ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de configuraciones de ejecuciones'));
        this.generalesService.quitarLoader();
      },
      () => {
        this.noData = this.dataSource.connect().pipe(map(data => data.length === 0));
        this.generalesService.quitarLoader();
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarConfigEjecucionesId(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = 'Editar Configuración de Ejecución';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(CONFIG_MODAL.data));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigEjecucionesComponent, CONFIG_MODAL);
  }

  consultarConfiguEjecucionesId(id: number) {
    const m = new ConfigEjecuciones();
    m.opcion = 4;
    m.ejecucionConfiguracionId = id;

    this.configEjecucionesService.obtenerConfigEjecuciones(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          if (res.datos.length > 0) {
            this.abrirModalEditar(res.datos[0]);        
          }else{
            this.generalesService.notificar(new NotificacionModel('warning', `No se encontró el registro`));
          }

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar configuraciones de ejecuciones por Id ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Error al consultar configuraciones de ejecuciones por Id'));
      },
      () => {
      }
    );
  }

  abrirModalEditar(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = 'Editar Configuración de Ejecución';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(CONFIG_MODAL.data));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    console.log(CONFIG_MODAL);
     this.modal.open(ModalGuardarConfigEjecucionesComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nueva Configuración de Ejecución',
      edit: false,
      opcion: 1
    };
    dialogConfig.data.horaDesde = '';
    dialogConfig.data.horaHasta = '';
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    console.log(dialogConfig);
    // this.modal.open(ModalGuardarConfigEjecucionesComponent, dialogConfig);
  }

  

  actualizarEstado(e: Event, row) {
    this.configEjecucionesModel.opcion = 3;
    this.configEjecucionesModel.ejecucionConfiguracionId = row.ejecucionConfiguracionId;
    this.configEjecucionesModel.baja = !e['checked'];

    this.configEjecucionesService.actualizarEstado(this.configEjecucionesModel).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
        }

      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error.'));
      },
      () => { }
    );
  }

}
