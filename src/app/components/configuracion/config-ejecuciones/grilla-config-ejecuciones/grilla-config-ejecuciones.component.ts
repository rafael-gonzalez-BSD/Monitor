import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfigEjecucionesService } from '../../../../services/configuracion/config-ejecuciones.service';
import { ModalGuardarConfigEjecucionesComponent } from '../modal-guardar-config-ejecuciones/modal-guardar-config-ejecuciones.component';
import { MatDialogConfig, MatTableDataSource, PageEvent, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { ConfigEjecuciones } from 'src/app/models/configuracion/config-ejecuciones';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { map } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';

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

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  configEjecucionesModel = new ConfigEjecuciones();
  configEjecucionesSubs: Subscription;

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private generalesService: GeneralesService,
    private configEjecucionesService: ConfigEjecucionesService,
    private modal: MatDialog
  ) { }

  ngOnInit() {

    this.dtOptions = CONFIGURACION;
    this.configEjecucionesSubs = this.configEjecucionesService.filtros.subscribe((m: any) => {
      this.obtenerConfigEjecuciones(m);

    });
    this.configEjecucionesService.obtenerFiltros();
    this.configEjecucionesService.setearFiltros();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.configEjecucionesSubs) {
      this.configEjecucionesSubs.unsubscribe();
    }
  }

  rerender(): void {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
    setTimeout(() => {
      this.verTabla = true;
    }, 0);
  }


  obtenerConfigEjecuciones(m: ConfigEjecuciones) {
    this.configEjecucionesService.obtenerConfigEjecuciones(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.verTabla = false;
          this.config = res.datos;

          // Validamos si debemos paginar o no
          // tslint:disable-next-line: radix
          const tamanioPaginar = parseInt(localStorage.getItem('tamanioPaginar'));
          if (res.datos.length > tamanioPaginar) {
            this.dtOptions.paging = true;
            this.dtOptions.info = true;
          } else {
            this.dtOptions.paging = false;
            this.dtOptions.info = false;
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
        this.generalesService.quitarLoader();
      }
    );
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
          } else {
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
    CONFIG_MODAL.data.tituloModal = 'Editar Bitácora de Ejecución';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(CONFIG_MODAL.data));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigEjecucionesComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nueva Bitácora de Ejecución',
      edit: false,
      opcion: 1
    };
    dialogConfig.data.horaDesde = '';
    dialogConfig.data.horaHasta = '';
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigEjecucionesComponent, dialogConfig);
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
