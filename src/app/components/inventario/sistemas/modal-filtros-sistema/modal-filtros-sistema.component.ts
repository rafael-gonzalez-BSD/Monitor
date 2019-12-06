import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Sistema } from '../../../../models/inventario/sistema';

@Component({
  selector: 'app-modal-filtros-sistema',
  templateUrl: './modal-filtros-sistema.component.html',
  styleUrls: ['./modal-filtros-sistema.component.scss']
})
export class ModalFiltrosSistemaComponent implements OnInit {
  tituloModal: string;
  datosComboSistema: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sistemaService: SistemaService) {
    this.tituloModal = data.tituloModal;
  }

  ngOnInit() {
    this.consultarSistemaCombo();
  }
  consultarSistemaCombo() {
    const m = new Sistema();
    m.Opcion = 3;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosComboSistema = response.datos;
        } else {
          alert('Error al consultar el combo de sistemas');
        }
      },
      err => {},
      () => {}
    );
  }
}
