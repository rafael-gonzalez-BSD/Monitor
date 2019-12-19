import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { GeneralesService } from '../../services/general/generales.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-menu-movil',
  templateUrl: './menu-movil.component.html',
  styleUrls: ['./menu-movil.component.scss']
})
export class MenuMovilComponent implements OnInit {
  // tslint:disable-next-line: radix
  tabActivo = parseInt(localStorage.getItem('indexMenu'));
  tarjetasMonitor = [
    {
      titulo: 'Dashboard',
      ruta: '../dashboard'
    },
    {
      titulo: 'Bitácora de Excepciones',
      ruta: '../excepciones'
    },
    {
      titulo: 'Bitácora de Ejecuciones',
      ruta: '../ejecuciones'
    },
    {
      titulo: 'Monitoreo',
      ruta: '../monitoreo'
    }
  ];

  tarjetasConfiguracion = [
    {
      titulo: 'Bitácora de Excepciones',
      ruta: '../config-excepciones'
    },
    {
      titulo: 'Bitácora de Ejecuciones',
      ruta: '../config-ejecuciones'
    },
    {
      titulo: 'Bitácora de Monitoreo',
      ruta: '../config-conectores'
    }
  ];

  tarjetasInventario = [
    {
      titulo: 'Catálogo de Sistemas',
      ruta: '../sistemas',
      tituloMovil: 'CATÁLOGO DE SISTEMAS'
    },
    {
      titulo: 'Catálogo de Procesos',
      ruta: '../procesos',
      tituloMovil: 'CATÁLOGO DE PROCESOS'
    },
    {
      titulo: 'Catálogo de Perfiles',
      ruta: '',
      tituloMovil: 'CATÁLOGO DE PERFILES'
    },
    {
      titulo: 'Administrar Mantenimientos',
      ruta: '../mantenimientos',
      tituloMovil: 'ADMINISTRAR DE MANTENIMIENTOS'
    }
  ];


  constructor(private rout: Router, private breakpointObserver: BreakpointObserver, private generalesService: GeneralesService) {
    this.breakpointObserver
      .observe(['(min-width: 813px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          if (rout.url === '/site/menu') {
            rout.navigate(['site/dashboard']);
          }
        }
      });
  }

  ngOnInit() {
    this.generalesService.setearTituloMovil('MENÚ');
    this.generalesService.quitarLoader();
  }

  enrutamiento(tab) {
    switch (tab.index) {
      case 0: {
        localStorage.setItem('indexMenu', '0')
        break;
      }
      case 1: {
        localStorage.setItem('indexMenu', '1')
        break;
      }
      case 2: {
        localStorage.setItem('indexMenu', '2')
        break;
      }
      default: {
        localStorage.setItem('indexMenu', '0')
        break;
      }
    }
  }
}
