import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-config-ejecuciones',
  templateUrl: './config-ejecuciones.component.html',
  styleUrls: ['./config-ejecuciones.component.scss']
})
export class ConfigEjecucionesComponent implements OnInit {

  constructor( private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) { 
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('CONFIGURAR EJECUCIONES');
      }
    });
  }

  ngOnInit() {
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

}