import { Component, OnInit } from '@angular/core';
import { GeneralesService } from '../../services/general/generales.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading: boolean;
  constructor(private generalesService: GeneralesService) { }
  ngOnInit() {
    this.generalesService.loader.subscribe((v: boolean) => {
      setTimeout(() => this.loading = v, 300);
    });
  }
}
