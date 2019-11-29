import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  open = true;

  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle() {
    this.open = !this.open;
    this.change.emit(this.open);
  }
}
