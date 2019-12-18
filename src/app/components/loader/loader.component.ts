import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/general/loader.service';
import { GeneralesService } from '../../services/general/generales.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading: boolean;
  constructor(private loaderService: LoaderService, private generalesService: GeneralesService) {
    this.loaderService.isLoading.subscribe(v => {
      console.log(v);
      this.loading = v;
    });
  }
  ngOnInit() {
    this.generalesService.loader.subscribe((v: boolean) => {
      setTimeout(() => this.loading = v, 300);
    });
  }
}
