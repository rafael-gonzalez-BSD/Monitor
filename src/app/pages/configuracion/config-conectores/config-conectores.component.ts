import { Component, OnInit } from '@angular/core';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-config-conectores',
  templateUrl: './config-conectores.component.html',
  styleUrls: ['./config-conectores.component.scss']
})
export class ConfigConectoresComponent implements OnInit {

  constructor( private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) { 
      this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('CONFIGURAR MONITOREO');
      }
    });
  }

  ngOnInit() {
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

}