import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';

@Component({
  selector: 'app-grilla-mantenimiento',
  templateUrl: './grilla-mantenimiento.component.html',
  styleUrls: ['./grilla-mantenimiento.component.scss']
})
export class GrillaMantenimientoComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'fechaInicio', 'horaInicio', 'fechaFin', 'horaFin', 'estado'];
  pageSizeOptions = [10, 25, 100];
  pageSize = 2;
  length: number;
  dataSource: MatTableDataSource<Mantenimiento>;
  m: Mantenimiento;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private mantenimientoService: MantenimientoService) { }

  ngOnInit() {
    this.m = new Mantenimiento();
    this.m.opcion = 4;
    this.obtenerMantenimientos(this.m);
  }

  obtenerMantenimientos(m: Mantenimiento) {
    this.mantenimientoService.obtenerMantenimientos(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          console.log(res.datos);
          
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

}
