import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
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
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  dataSource: MatTableDataSource<Mantenimiento>;
  m: Mantenimiento;
  toggleBaja = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private mantenimientoService: MantenimientoService,
    private modal: MatDialog,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.abrirModalGuardar();
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
    this.mantenimientoService.obtenerMantenimientos(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.dataSource = new MatTableDataSource(res.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.length = res.datos.length;
        } else {
          alert(`Error al consultar el listado de mantenimientos. ${res.mensaje}`);
        }
      },
      err => {
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
    CONFIG_MODAL.data.opcion = 3;
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
      esEdicion: false,
      tituloModal: 'Nueva Ventana de Mantenimientos',
      opcion: 1
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarMantenimientoComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.m.opcion = 3;
    this.m.ventanaMantenimientoId = row.ventanaMantenimientoId;
    this.m.baja = !e['checked'];

    this.mantenimientoService.actualizarEstado(this.m).subscribe(
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

  changeMatToggle(event) {
    this.toggleBaja = event.checked;
  }

}
