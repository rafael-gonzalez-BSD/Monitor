import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-excepciones',
  templateUrl: './excepciones.component.html',
  styleUrls: ['./excepciones.component.scss']
})
export class ExcepcionesComponent implements OnInit {

  constructor( private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) { 
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('BITÁCORA DE EXCEPCIONES');
      }
    });
   }

  ngOnInit() {
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

}
