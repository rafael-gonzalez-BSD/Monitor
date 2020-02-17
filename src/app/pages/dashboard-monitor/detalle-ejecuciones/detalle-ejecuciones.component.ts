import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-detalle-ejecuciones',
  templateUrl: './detalle-ejecuciones.component.html',
  styleUrls: ['./detalle-ejecuciones.component.scss']
})
export class DetalleEjecucionesComponent implements OnInit {
  ejecucionId: number;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
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
}
