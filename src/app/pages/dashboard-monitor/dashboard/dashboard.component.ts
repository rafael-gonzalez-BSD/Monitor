import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private generalesService: GeneralesService,
    private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(min-width: 813px)']).subscribe((state: BreakpointState) => {
      if (!state.matches) {
        this.setearTitulo('DASHBOARD');
      }
    });
  }

  ngOnInit() {
    /// TODO: Quitar esta linea de codigo una vez haya integrado los indicadores del dashboard.
    this.generalesService.quitarLoader();
  }

  setearTitulo(titulo) {
    this.generalesService.setearTituloMovil(titulo);
  }

}
