import { ProcesoService } from './../../../services/inventario/proceso.service';
import { Component, OnInit } from '@angular/core';
import { Proceso } from '../../../models/inventario/proceso';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  tableColumns: string[] = ['accion', 'sistema', 'identificador', 'proceso', 'estado', 'critico'];
  dataSource: object[] = [];
  constructor(private procesoService: ProcesoService) { }

  ngOnInit() {
    this.obtenerProcesos(new Proceso());
  }

  obtenerProcesos(m: Proceso) {
    this.procesoService.obtenerProcesos(m).subscribe((res: any) => {
      console.log(res);
      this.dataSource = res;
    });
  }
}
