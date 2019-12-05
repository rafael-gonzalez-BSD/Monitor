import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss']
})
export class Layout1Component implements OnInit {
  open = true;
  mostrarMenu1 =  false;
  mostrarMenu2 =  false;
  constructor(private sidebarService: SidebarService, private router: Router, private breakpointObserver: BreakpointObserver) {
    
   }

  ngOnInit() {
    this.sidebarService.change.subscribe(open => {
      this.open = open;
    });
    
  }
}
