import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { ModalGuardarMantenimientoComponent } from '../modal-guardar-mantenimiento/modal-guardar-mantenimiento.component';

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private mantenimientoService: MantenimientoService,
    private modal: MatDialog) { }

  ngOnInit() {
    this.mantenimientoService.filtros.subscribe((m: any) => {
      if (m.baja === null) delete m.baja;
      this.obtenerMantenimientos(m);
    });
    this.mantenimientoService.obtenerFiltros();
    this.mantenimientoService.setearFiltros();
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
      () => {}
    );
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      esEdicion: false,
      tituloModal: 'Nueva Ventana de Mantenimientos',
    };
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarMantenimientoComponent, dialogConfig);
  }

}
