import { Component, OnInit, ViewChild } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sistema } from '../../../../models/inventario/sistema';
import { ModalGuardarSistemaComponent } from '../modal-guardar-sistema/modal-guardar-sistema.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-grilla-sistema',
  templateUrl: './grilla-sistema.component.html',
  styleUrls: ['./grilla-sistema.component.scss']
})
export class GrillaSistemaComponent implements OnInit {
  tableColumns: string[] = ['accion', 'identificador', 'alias', 'nombre', 'areaPropietaria', 'descripcion', 'estado'];
  dataSource: MatTableDataSource<Sistema>;
  sistemaModel = new Sistema();
  pageSizeOptions = [10, 25, 100];
  pageSize = 10;
  length: number;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private sistemaService: SistemaService, private generalesService: GeneralesService, private modal: MatDialog) { }

  ngOnInit() {
    this.sistemaService.filtros.subscribe((m: any) => {
      if (m.baja === null) delete m.baja;
      this.consultarSistemaAll(m);
    });
    this.sistemaService.obtenerFiltros();
    this.sistemaService.setearFiltros();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  consultarSistemaAll(m: Sistema) {
    this.generalesService.mostrarLoader();
    this.sistemaService.consultarSistemaAll(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.dataSource = new MatTableDataSource(response.datos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.length = response.datos.length;
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', 'Error al consultar el listado de sistemas. ' + response.mensaje));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', 'Ocurrió un error al consultar el listado de sistemas'));
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

  consultarSistemaId(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.insercion = false;
    CONFIG_MODAL.data.tituloModal = 'Editar Sistema';
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarSistemaComponent, CONFIG_MODAL);
    console.log(datosEditar);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      insercion: true,
      tituloModal: 'Agregar Sistema',
      gerenciaId: '-1'
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarSistemaComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.sistemaModel.opcion = 4;
    this.sistemaModel.sistemaId = row.sistemaId;
    this.sistemaModel.baja = !e['checked'];

    this.sistemaService.actualizarEstado(this.sistemaModel).subscribe(
      (response: any) => {
        alert(response.mensaje);
        this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error'));
      },
      () => { }
    );
  }
}
