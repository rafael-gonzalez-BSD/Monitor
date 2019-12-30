import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig, PageEvent } from '@angular/material';
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { ModalGuardarMantenimientoComponent } from '../modal-guardar-mantenimiento/modal-guardar-mantenimiento.component';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-grilla-mantenimiento',
  templateUrl: './grilla-mantenimiento.component.html',
  styleUrls: ['./grilla-mantenimiento.component.scss']
})
export class GrillaMantenimientoComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'fechaInicio', 'horaInicio', 'fechaFin', 'horaFin', 'estado'];
  dataSource: MatTableDataSource<Mantenimiento>;
  mantenimientoModel = new Mantenimiento;
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private mantenimientoService: MantenimientoService,
    private generalesService: GeneralesService,
    private modal: MatDialog) { }

  ngOnInit() {
    this.mantenimientoService.filtros.subscribe((m: any) => {
      if (m.baja === null) delete m.baja;
      this.obtenerMantenimientos(m);
    });
    this.mantenimientoService.obtenerFiltros();
    this.mantenimientoService.setearFiltros();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  obtenerMantenimientos(m: Mantenimiento) {
    this.generalesService.mostrarLoader();
    this.mantenimientoService.obtenerMantenimientos(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.dataSource = new MatTableDataSource(res.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.length = res.datos.length;
        } else {
          this.generalesService.notificar(
            new NotificacionModel(
              'warning',
              `Error al consultar el listado de mantenimientos. ${res.mensaje}`
            )
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de mantenimientos'));
        alert('Ocurrió un error al consultar el listado de mantenimientos');
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

  consultarMantenimientoId(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = 'Editar Ventana de Mantenimientos';
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarMantenimientoComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nueva Ventana de Mantenimientos',
      edit: false,
      opcion: 1
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarMantenimientoComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    debugger
    this.mantenimientoModel.opcion = 3;
    this.mantenimientoModel.ventanaMantenimientoId = row.ventanaMantenimientoId;
    this.mantenimientoModel.baja = !e['checked'];

    this.mantenimientoService.actualizarEstado(this.mantenimientoModel).subscribe(
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
