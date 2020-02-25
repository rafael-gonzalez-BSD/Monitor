import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-detalle-monitoreo',
  templateUrl: './detalle-monitoreo.component.html',
  styleUrls: ['./detalle-monitoreo.component.scss']
})
export class DetalleMonitoreoComponent implements OnInit {

  conectorId: number;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router, 
    private generalesService: GeneralesService
  ) { }

  ngOnInit() {
    this.setearTitulo('MONITOREO // DETALLE');
    this.conectorId = this.rutaActiva.snapshot.params.id;
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.conectorId = params.id;
      }
    );
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/monitoreo']);
  }

}
