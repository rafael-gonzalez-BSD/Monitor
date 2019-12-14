import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralesService {
  setTituloMovil = new EventEmitter(true);

  constructor() {}

  setearTituloMovil(t: string) {
    this.setTituloMovil.emit(t);
  }
}
