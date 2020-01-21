import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-excepciones',
  templateUrl: './detalle-excepciones.component.html',
  styleUrls: ['./detalle-excepciones.component.scss']
})
export class DetalleExcepcionesComponent implements OnInit {
  id: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

}
