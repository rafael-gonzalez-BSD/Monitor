import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-detalle-ejecuciones',
  templateUrl: './detalle-ejecuciones.component.html',
  styleUrls: ['./detalle-ejecuciones.component.scss']
})
export class DetalleEjecucionesComponent implements OnInit {
  ejecucionId: number;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router,
    private generalesService: GeneralesService
  ) { }

  ngOnInit() {
    this.setearTitulo('EJECUCIóN // DETALLE')
    this.ejecucionId = this.rutaActiva.snapshot.params.id;
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.ejecucionId = params.id;
      }
    );
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/ejecuciones']);
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }
}
