import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.scss']
})
export class MantenimientosComponent implements OnInit {

  constructor( private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) { 
    // seteamos el  título del navbar movil
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('MANTENIMIENTOS');
      }
    });
  }

  ngOnInit() {
  }
  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

}
