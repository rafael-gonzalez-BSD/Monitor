import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';
import { MatTableDataSource, PageEvent, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { ConfigConectoresService } from '../../../../services/configuracion/config-conectores.service';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { ModalGuardarConfigConectoresComponent } from '../modal-guardar-config-conectores/modal-guardar-config-conectores.component';

@Component({
  selector: 'app-grilla-config-conectores',
  templateUrl: './grilla-config-conectores.component.html',
  styleUrls: ['./grilla-config-conectores.component.scss']
})
export class GrillaConfigConectoresComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'conectorConfiguracionId', 'conectorConfiguracionDescripcion', 'urlApi', 'estado'];
  dataSource: MatTableDataSource<ConfigConectores>;
  configConectoresModel = new ConfigConectores();
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private generalesService: GeneralesService,
    private configConectoresService: ConfigConectoresService,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    this.configConectoresService.filtros.subscribe((m: any) => {
      this.obtenerConfigConectores(m);
    });
    this.configConectoresService.obtenerFiltros();
    this.configConectoresService.setearFiltros();
    this.abrirModalGuardar();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  obtenerConfigConectores(m: ConfigConectores) {
    this.generalesService.mostrarLoader();
    this.configConectoresService.obtenerConfigConectores(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.dataSource = new MatTableDataSource(res.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.length = res.datos.length;
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el listado de configuraciones de conectores. ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de configuraciones de conectores'));
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

  consultarConfigConectoresId(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = 'Editar Configuración de Conector';
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '70%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigConectoresComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nueva Configuración de Conector',
      edit: false,
      opcion: 1
    };
    dialogConfig.data.horaDesde = '';
    dialogConfig.data.horaHasta = '';
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigConectoresComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.configConectoresModel.opcion = 3;
    this.configConectoresModel.conectorConfiguracionId = row.conectorConfiguracionId;
    this.configConectoresModel.baja = !e['checked'];

    this.configConectoresService.actualizarEstado(this.configConectoresModel).subscribe(
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
