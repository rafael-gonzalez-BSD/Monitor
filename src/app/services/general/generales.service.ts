import { Injectable, EventEmitter } from '@angular/core';
import { NotificacionModel } from '../../models/base/notificacion';

@Injectable({
  providedIn: 'root'
})
export class GeneralesService {
  setTituloMovil = new EventEmitter(true);
  notificacion = new EventEmitter();

  constructor() {}

  setearTituloMovil(t: string) {
    this.setTituloMovil.emit(t);
  }

  notificar(n: NotificacionModel) {
    this.notificacion.emit(n);
  }
}
