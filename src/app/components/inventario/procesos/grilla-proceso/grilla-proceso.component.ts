import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Proceso } from 'src/app/models/inventario/proceso';
import { ModalGuardarProcesoComponent } from '../modal-guardar-proceso/modal-guardar-proceso.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { config } from 'rxjs';

@Component({
  selector: 'app-grilla-proceso',
  templateUrl: './grilla-proceso.component.html',
  styleUrls: ['./grilla-proceso.component.scss']
})
export class GrillaProcesoComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'identificador', 'proceso', 'estado', 'critico'];
  dataSource: MatTableDataSource<Proceso>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private procesoService: ProcesoService, private modal: MatDialog) {}

  ngOnInit() {
    const m = new Proceso();
    m.opcion = 4;
    m.sistemaId = 0;
    m.procesoId = 0;
    m.procesoDescripcion = '';
    this.obtenerProcesos(m);
    this.procesoService.filtros.subscribe((m: any) => {
      this.obtenerProcesos(m);
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
    this.modal.open(ModalGuardarProcesoComponent, dialogConfig);
  }

  obtenerProcesos(m: Proceso) {
    this.procesoService.obtenerProcesos(m).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.datos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
    this.modal.open(ModalGuardarProcesoComponent, CONFIG_MODAL);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}