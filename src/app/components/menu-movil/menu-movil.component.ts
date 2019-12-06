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
      ruta: '../config-conectorees'
    }
  ];

  tarjetasInventario = [
    {
      titulo: 'Catálogo de Sistemas',
      ruta: '../sistemas'
    },
    {
      titulo: 'Catálogo de Procesos',
      ruta: '../procesos'
    },
    {
      titulo: 'Catálogo de Perfiles',
      ruta: ''
    },
    {
      titulo: 'Administrar Mantenimientos',
      ruta: '../mantenimientos'
    }
  ];


  constructor(private rout: Router, private breakpointObserver: BreakpointObserver, private generalesService: GeneralesService) {
    this.breakpointObserver
      .observe(['(max-width: 1025px)', Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe((state: BreakpointState) => {
        console.log(rout.url);
        if (state.matches) {
          
        } else {
          console.log(rout.url);
          if (rout.url==='/site/dashboard' || rout.url === '/site/menu') {
            rout.navigate(['site/dashboard']);
          console.log('Se manda al dasboard desde el menu ts');            
          }
          
          
        }
      });
  }

  ngOnInit() {
  }

  enrutamiento( tab ) {
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
