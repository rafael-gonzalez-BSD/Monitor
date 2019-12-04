import { Component, OnInit, ViewChild } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Opcion } from '../../../../models/base/opcion';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { Sistema } from '../../../../models/inventario/sistema';
import { ModalGuardarSistemaComponent } from '../modal-guardar-sistema/modal-guardar-sistema.component';

@Component({
  selector: 'app-grilla-sistema',
  templateUrl: './grilla-sistema.component.html',
  styleUrls: ['./grilla-sistema.component.scss']
})
export class GrillaSistemaComponent implements OnInit {
  tableColumns: string[] = ['accion', 'identificador', 'alias', 'nombre', 'areaPropietaria', 'descripcion', 'estado'];
  dataSource: MatTableDataSource<Sistema>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  Opcion = '4';
  SistemaDescripcion = 'si';
  Baja = null;
  datosGrilla: any;

  // modal


  constructor(private sistemaService: SistemaService, private modal: MatDialog) { }

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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarSistemaId(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = "Editar Sistema";
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarSistemaComponent, CONFIG_MODAL);
    console.log(datosEditar);
    
  }
}
