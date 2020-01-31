import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ConfigExcepciones } from '../../../../models/configuracion/config-excepciones';
import { MatTableDataSource, PageEvent, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { GeneralesService } from '../../../../services/general/generales.service';
import { ConfigExcepcionesService } from '../../../../services/configuracion/config-excepciones.service';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { ModalGuardarConfigExcepcionesComponent } from '../modal-guardar-config-excepciones/modal-guardar-config-excepciones.component';
import { map } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { getConfigDataTable } from 'src/app/extensions/dataTable/dataTable';

@Component({
  selector: 'app-grilla-config-excepciones',
  templateUrl: './grilla-config-excepciones.component.html',
  styleUrls: ['./grilla-config-excepciones.component.scss']
})
export class GrillaConfigExcepcionesComponent implements AfterViewInit, OnDestroy, OnInit {
  // DataTable
  dtOptions: any = {};
  listadoConfiguExcepciones: ConfigExcepciones[] = [];
  dtTrigger: Subject<ConfigExcepciones> = new Subject();
  paginar = false;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  configExcepcionesSubs: Subscription;
  configExcepcionesModel = new ConfigExcepciones();
  length: number;

  constructor(
    private generalesService: GeneralesService,
    private configExcepcionesService: ConfigExcepcionesService,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    this.dtOptions = getConfigDataTable();
    this.configExcepcionesSubs = this.configExcepcionesService.filtros.subscribe((m: any) => {
      this.obtenerConfigExcepciones(m);
    });
    this.configExcepcionesService.obtenerFiltros();
    this.configExcepcionesService.setearFiltros();

  }

  ngAfterViewInit(){
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    if (this.configExcepcionesSubs) {
      this.configExcepcionesSubs.unsubscribe();      
    }    
  }

  rerender() {
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  obtenerConfigExcepciones(m: ConfigExcepciones) {
    this.generalesService.mostrarLoader();
    this.configExcepcionesService.obtenerConfigExcepciones(m).subscribe(
      (response: RespuestaModel) => {
        if (response.satisfactorio) {
          this.listadoConfiguExcepciones = response.datos;
          this.length = response.datos.length;

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
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el listado de configuraciones de excepciones: ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de configuraciones de excepciones'));
        this.generalesService.quitarLoader();
      },
      () => {
        this.generalesService.quitarLoader();
      }
    );
  }

  consultarConfigExcepcionesId(id: number) {
    const m = new ConfigExcepciones();
    m.opcion = 4;
    m.excepcionConfiguracionId = id;

    this.configExcepcionesService.obtenerConfigExcepciones(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          if (res.datos.length > 0) {
            this.abrirModalEditar(res.datos[0]);        
          }else{
            this.generalesService.notificar(new NotificacionModel('warning', `No se encontró el registro`));
          }

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar configuracion de excepciones por Id ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Error al consultar configuracion de excepciones por Id'));
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
    CONFIG_MODAL.data.tituloModal = 'Editar Configuración de Excepción';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(datosEditar));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigExcepcionesComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nueva Configuración de Excepción',
      edit: false,
      opcion: 1
    };
    dialogConfig.data.horaDesde = '';
    dialogConfig.data.horaHasta = '';
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigExcepcionesComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.configExcepcionesModel.opcion = 3;
    this.configExcepcionesModel.excepcionConfiguracionId = row.excepcionConfiguracionId;
    this.configExcepcionesModel.baja = !e['checked'];

    this.configExcepcionesService.actualizarEstado(this.configExcepcionesModel).subscribe(
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
