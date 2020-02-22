import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-detalle-monitoreo',
  templateUrl: './detalle-monitoreo.component.html',
  styleUrls: ['./detalle-monitoreo.component.scss']
})
export class DetalleMonitoreoComponent implements OnInit {

  conectorId: number;

  constructor(
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.conectorId = this.rutaActiva.snapshot.params.id;
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.conectorId = params.id;
      }
    );
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/monitoreo']);
  }

}
