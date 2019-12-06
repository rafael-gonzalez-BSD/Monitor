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
  debugger;
  // tslint:disable-next-line: radix
  tabActivo = parseInt(localStorage.getItem('indexMenu'));
  selected = new FormControl(0);


  constructor(private rout: Router, private breakpointObserver: BreakpointObserver, private generalesService: GeneralesService) {
    this.breakpointObserver
      .observe(['(max-width: 1025px)', Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {

        } else {
          rout.navigate(['../dashboard']);
        }
      });



  }

  ngOnInit() {
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
