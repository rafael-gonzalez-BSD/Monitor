import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { SistemaService } from 'src/app/services/inventario/sistema.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Combo } from 'src/app/models/base/combo';
import { Observable } from 'rxjs';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { Sistema } from 'src/app/models/inventario/sistema';
import { startWith, map } from 'rxjs/operators';
import { RequireMatch } from 'src/app/extensions/autocomplete/require-match';

@Component({
  selector: 'app-modal-guardar-mantenimiento',
  templateUrl: './modal-guardar-mantenimiento.component.html',
  styleUrls: ['./modal-guardar-mantenimiento.component.scss']
})
export class ModalGuardarMantenimientoComponent implements OnInit {
  esEdicion =  false;
  tituloModal: string;
  toggleBaja = true;
  grupoFormulario: FormGroup;

  datosCombo: Combo[];
  sistemaCombo: Observable<Combo[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sistemaService: SistemaService,
    private mantenimientoService: MantenimientoService,
    private modal: MatDialog,
    private generalesService: GeneralesService
  ) { 
    this.consultarSistemaCombo();
    this.esEdicion =  data.esEdicion;
    this.tituloModal =  data.tituloModal;
  }

  ngOnInit() {
    this.grupoFormulario = this.validarFormulario();
    this.sistemaCombo = this.grupoFormulario.get('sistemaId').valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descripcion)),
      map(name => this.filter(name, this.datosCombo))
    );
  }

  filter(valor: string, datosCombo: Combo[]) {
    if (valor.length < 4) return [];
    const filterName = valor.toLowerCase();
    return datosCombo.filter(option => option.descripcion.toLowerCase().includes(filterName));
  }


  validarFormulario() {
    return new FormGroup({
      sistemaId: new FormControl('', [RequireMatch]),
    });
  }

  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
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
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el combo de sistemas. ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrio un error.'));
      },
      () => { }
    );
  }

}
