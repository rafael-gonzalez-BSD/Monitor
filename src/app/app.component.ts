import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { GeneralesService } from './services/general/generales.service';
import { NotificacionModel } from './models/base/notificacion';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Monitor';

  @ViewChild('personalizado', { static: true }) personalidadoTmpl;

  private notifier: NotifierService;
  private generalesService: GeneralesService;

  public constructor(notifier: NotifierService, generalesService: GeneralesService) {
    this.notifier = notifier;
    this.generalesService = generalesService;
  }

  ngOnInit() {
    this.generalesService.notificacion.subscribe((n: NotificacionModel) => {
      this.notifier.show({
        type: n.tipo,
        message: n.mensaje,
        template: this.personalidadoTmpl
      });
    });
  }
}
