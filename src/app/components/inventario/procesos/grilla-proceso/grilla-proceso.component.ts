import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Proceso } from 'src/app/models/inventario/proceso';
import { ModalGuardarProcesoComponent } from '../modal-guardar-proceso/modal-guardar-proceso.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Sistema } from 'src/app/models/inventario/sistema';
import { RespuestaModel } from '../../../../models/base/respuesta';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-grilla-proceso',
  templateUrl: './grilla-proceso.component.html',
  styleUrls: ['./grilla-proceso.component.scss']
})
export class GrillaProcesoComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'identificador', 'proceso', 'estado', 'critico'];
  dataSource: MatTableDataSource<Proceso>;
  procesoModel = new Proceso();
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private procesoService: ProcesoService,
    private sistemaService: SistemaService,
    private generalesService: GeneralesService,
    private modal: MatDialog) { }

  ngOnInit() {
    this.procesoService.filtros.subscribe((m: any) => {
      this.obtenerProcesos(m);
    });
    this.procesoService.obtenerFiltros();
    this.procesoService.setearFiltros();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  obtenerProcesos(m: Proceso) {
    this.procesoService.obtenerProcesos(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          this.dataSource = new MatTableDataSource(res.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.length = res.datos.length;
          this.generalesService.notificar(new NotificacionModel('success', 'Se cargo la grilla Procesos.'));
        } else {
          this.generalesService.notificar(new NotificacionModel('success', 'Error al consultar el listado de procesos. ' + res.mensaje));
        }
      },
      err => {
        alert('Ocurrió un error al consultar el listado de procesos');
      },
      () => { }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarProcesoId(datosEditar: any) {
    console.log('Datos de edicion', datosEditar);
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 3;
    CONFIG_MODAL.data.tituloModal = 'Editar Proceso';
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.sistemaService.consultarSistemaCombo(new Sistema(3)).subscribe(res => {
      CONFIG_MODAL.data.datosCombo = res['datos'];
      this.modal.open(ModalGuardarProcesoComponent, CONFIG_MODAL);
    });
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nuevo Proceso',
      edit: false,
      opcion: 1
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.sistemaService.consultarSistemaCombo(new Sistema(3)).subscribe(res => {
      dialogConfig.data.datosCombo = res['datos'];
      this.modal.open(ModalGuardarProcesoComponent, dialogConfig);
    });
  }

  actualizarEstado(e: Event, row) {
    this.procesoModel.opcion = 4;
    this.procesoModel.procesoId = row.procesoId;
    this.procesoModel.baja = !e['checked'];

    this.procesoService.actualizarEstado(this.procesoModel).subscribe(
      (response: any) => {
        alert(response.mensaje);
      },
      err => {
        alert('Ocurrió un error');
      },
      () => { }
    );
  }

  actualizarCritico(e: Event, row) {
    this.procesoModel.opcion = 5;
    this.procesoModel.procesoId = row.procesoId;
    this.procesoModel.critico = e['checked'];

    this.procesoService.actualizarCritico(this.procesoModel).subscribe(
      (response: any) => {
        alert(response.mensaje);
      },
      err => {
        alert('Ocurrió un error');
      },
      () => { }
    );
  }
}
