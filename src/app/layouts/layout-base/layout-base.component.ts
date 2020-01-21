import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout-base',
  templateUrl: './layout-base.component.html',
  styleUrls: ['./layout-base.component.scss']
})
export class LayoutBaseComponent implements OnInit {

  constructor( public breakpointObserver: BreakpointObserver ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-height: 40rem)')) {
    }
  }

  mediaQuery() {
    this.breakpointObserver
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
        } else {
        }
      });
  }    
  

}
