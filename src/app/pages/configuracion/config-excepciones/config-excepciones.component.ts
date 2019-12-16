import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-config-excepciones',
  templateUrl: './config-excepciones.component.html',
  styleUrls: ['./config-excepciones.component.scss']
})
export class ConfigExcepcionesComponent implements OnInit {

  constructor( private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) { 
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('CONFIGURAR EXCEPCIONES');
      }
    });
  }

  ngOnInit() {
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

}
