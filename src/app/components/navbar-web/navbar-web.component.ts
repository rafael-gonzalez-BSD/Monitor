import { Component, OnInit, Input } from '@angular/core';
import { Layout1Component } from 'src/app/layouts/layout1/layout1.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-web',
  templateUrl: './navbar-web.component.html',
  styleUrls: ['./navbar-web.component.scss']
})
export class NavbarWebComponent implements OnInit {
  opened = true;
  constructor(private sidebarService: SidebarService, private router: Router) {}

  ngOnInit() {}

  showSidebar() {
    this.sidebarService.toggle();
  }

  goHome() {
    this.router.navigate(['site']);
  }
}
