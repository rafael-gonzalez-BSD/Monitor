import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'app-detalle-excepciones',
  templateUrl: './detalle-excepciones.component.html',
  styleUrls: ['./detalle-excepciones.component.scss']
})
export class DetalleExcepcionesComponent implements OnInit {
  excepcionId: number;

  

  constructor(private rutaActiva: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.excepcionId = this.rutaActiva.snapshot.params.id;
    this.rutaActiva.params.subscribe(
      (params: Params) => {
        this.excepcionId = params.id;
      }
    );
  }

  regresar() {
    localStorage.setItem('indexMenu', '0');
    this.router.navigate(['site/excepciones']);
  }
}
