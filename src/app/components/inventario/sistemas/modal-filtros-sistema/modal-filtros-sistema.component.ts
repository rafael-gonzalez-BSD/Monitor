import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { Sistema } from '../../../../models/inventario/sistema';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';
import { Combo } from 'src/app/models/base/combo';

@Component({
  selector: 'app-modal-filtros-sistema',
  templateUrl: './modal-filtros-sistema.component.html',
  styleUrls: ['./modal-filtros-sistema.component.scss']
})
export class ModalFiltrosSistemaComponent implements OnInit {
  tituloModal: string;
  datosCombo: any;
  sistemaCombo: Observable<Combo[]>;
  grupoFormulario: FormGroup;
  selected = '-1';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sistemaService: SistemaService) {
    this.tituloModal = data.tituloModal;
    this.consultarSistemaCombo();
    
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosCombo))
    );

    console.log(this.sistemaCombo);
    
  }

  filter(valor: string, datosCombo: Combo[]) {
    if (valor.length < 4) return [];
    const filterName = valor.toLowerCase();
    return datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName));
  }

  validarFormulario() {
    return new FormGroup({
      sistemaId: new FormControl('', [Validators.required, RequireMatch]),
      baja: new FormControl(),
    });
  }

  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }
  
  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosCombo = response.datos;
          console.log(this.datosCombo);
          
        } else {
          alert('Error al consultar el combo de sistemas');
        }
      },
      err => {},
      () => {}
    );
  }

  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }
  get baja() {
    return this.grupoFormulario.get('baja');
  }
  
}
