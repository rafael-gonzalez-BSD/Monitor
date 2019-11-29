import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  constructor(private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService) { }

  ngOnInit() {
    const breadcrumb =  {customText: 'This is Custom Text', dynamicText: 'Level 2 '};
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
  }

}
