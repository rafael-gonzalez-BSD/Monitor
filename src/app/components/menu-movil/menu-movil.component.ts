import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-menu-movil',
  templateUrl: './menu-movil.component.html',
  styleUrls: ['./menu-movil.component.scss']
})
export class MenuMovilComponent implements OnInit {
  activateHandsetLayout() {
    console.log('cambio detectado');
    
  }

  constructor( private rout: Router, private breakpointObserver: BreakpointObserver)  { 
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
    //this.enrutamiento();
    
  }

  enrutamiento (){
    this.breakpointObserver
      .observe(['(min-width: 1025)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.rout.navigate(['dashboard']);
          console.log('pantalla menor que 1025px');
          
        } else {
          console.log('pantalla mayor que 1024px');
        }
      });
  }
  // router(event){
    
  //   switch(event.index) { 
  //     case 0: { 
  //        console.log('a');
  //        this.rout.navigate(['dashboard']);         
  //        break; 
  //     } 
  //     case 2: { 
  //       console.log('b');
  //        this.rout.navigate(['site/sistemas']);         
  //        break;
  //     } 
  //     default: { 
  //       console.log('c');
  //        break; 
  //     } 
  //  } 
  // }

}
