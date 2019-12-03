import { Component, OnInit } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Opcion } from '../../../../models/base/opcion';

@Component({
  selector: 'app-grilla-sistema',
  templateUrl: './grilla-sistema.component.html',
  styleUrls: ['./grilla-sistema.component.scss']
})
export class GrillaSistemaComponent implements OnInit {
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
        
        
        this.datosGrilla = response.datos;
        console.log(this.datosGrilla);
        
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
