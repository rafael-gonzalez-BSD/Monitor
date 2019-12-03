import { ProcesoService } from './../../../services/inventario/proceso.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Proceso } from '../../../models/inventario/proceso';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'identificador', 'proceso', 'estado', 'critico'];
  dataSource: MatTableDataSource<Proceso>;

  constructor(private procesoService: ProcesoService) { }

  ngOnInit() {
    const m = new Proceso();
    m.opcion = 4;
    m.sistemaId = 0;
    m.procesoId = 0;
    m.procesoDescripcion = '';
    this.obtenerProcesos(m);
  }

  obtenerProcesos(m: Proceso) {
    this.procesoService.obtenerProcesos(m).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.datos);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
