import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigExcepciones } from '../../../../models/configuracion/config-excepciones';
import { MatTableDataSource, PageEvent, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { GeneralesService } from '../../../../services/general/generales.service';
import { ConfigExcepcionesService } from '../../../../services/configuracion/config-excepciones.service';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { ModalGuardarConfigExcepcionesComponent } from '../modal-guardar-config-excepciones/modal-guardar-config-excepciones.component';

@Component({
  selector: 'app-grilla-config-excepciones',
  templateUrl: './grilla-config-excepciones.component.html',
  styleUrls: ['./grilla-config-excepciones.component.scss']
})
export class GrillaConfigExcepcionesComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'rutaLog', 'frecuencia', 'horario', 'ventanaMantenimiento', 'estado'];
  dataSource: MatTableDataSource<ConfigExcepciones>;
  configExcepcionesModel = new ConfigExcepciones();
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private generalesService: GeneralesService,
    private configExcepcionesService: ConfigExcepcionesService,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    this.configExcepcionesService.filtros.subscribe((m: any) => {
      this.obtenerConfigExcepciones(m);
    });
    this.configExcepcionesService.obtenerFiltros();
    this.configExcepcionesService.setearFiltros();

  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  obtenerConfigExcepciones(m: ConfigExcepciones) {
    this.generalesService.mostrarLoader();
    this.configExcepcionesService.obtenerConfigExcepciones(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.dataSource = new MatTableDataSource(res.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.length = res.datos.length;
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al consultar el listado de configuraciones de excepciones. ' + res.mensaje));
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarConfigExcepcionesId(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = 'Editar Configuración de Excepción';
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
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
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
