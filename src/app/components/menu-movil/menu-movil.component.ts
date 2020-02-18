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
      titulo: 'Bitácora de Excepción',
      ruta: '../excepciones'
    },
    {
      titulo: 'Bitácora de Ejecución',
      ruta: '../ejecuciones'
    },
    {
      titulo: 'Monitoreo',
      ruta: '../monitoreo'
    }
  ];

  tarjetasConfiguracion = [
    {
      titulo: 'Bitácora de Excepción',
      ruta: '../config-excepciones'
    },
    {
      titulo: 'Bitácora de Ejecución',
      ruta: '../config-ejecuciones'
    },
    {
      titulo: 'Bitácora de Monitoreo',
      ruta: '../config-monitoreo'
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
    // {
    //   titulo: 'Catálogo de Perfiles',
    //   ruta: '',
    //   tituloMovil: 'CATÁLOGO DE PERFILES'
    // },
    {
      titulo: 'Programación de Mantenimientos',
      ruta: '../mantenimientos',
      tituloMovil: 'PROGRAMACIÓN DE MANTENIMIENTOS'
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
