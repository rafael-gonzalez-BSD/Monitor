import { Component, OnInit, ViewChild } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Opcion } from '../../../../models/base/opcion';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Sistema } from '../../../../models/inventario/sistema';

@Component({
  selector: 'app-grilla-sistema',
  templateUrl: './grilla-sistema.component.html',
  styleUrls: ['./grilla-sistema.component.scss']
})
export class GrillaSistemaComponent implements OnInit {
  tableColumns: string[] = ['accion', 'identificador', 'alias', 'nombre', 'areaPropietaria', 'descripcion', 'estado'];
  dataSource: MatTableDataSource<Sistema>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  Opcion = '4';
  SistemaDescripcion = 'si';
  Baja = null;
  datosGrilla: any;

  constructor(private sistemaService: SistemaService) { }

  ngOnInit() {
    this.consultarSistemaAll();
  }

  consultarSistemaAll() {
    this.sistemaService.consultarSistemaAll(this.Opcion, this.SistemaDescripcion, this.Baja).subscribe((response: any) => {
      console.log(response);
      if (response.satisfactorio) {
        this.dataSource = new MatTableDataSource(response.datos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      } else {
        alert('Error al consultar el listado de sistemas');
      }
    },
    err => {
      alert('Ocurrió un error al consultar el listado de sistemas');
    },
    () => {

    });
  }
}
