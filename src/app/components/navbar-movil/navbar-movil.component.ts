import { Component, OnInit } from '@angular/core';
import { GeneralesService } from '../../services/general/generales.service';

@Component({
  selector: 'app-navbar-movil',
  templateUrl: './navbar-movil.component.html',
  styleUrls: ['./navbar-movil.component.scss']
})
export class NavbarMovilComponent implements OnInit {
  titulo = 'MENÚ';

  constructor(private generalService: GeneralesService) { }

  ngOnInit() {
    this.setearTitulo();    
  }

  setearTitulo() {
    this.generalService.setTituloMovil.subscribe((t: string) => {
      this.titulo = t;
    });
  }

}
