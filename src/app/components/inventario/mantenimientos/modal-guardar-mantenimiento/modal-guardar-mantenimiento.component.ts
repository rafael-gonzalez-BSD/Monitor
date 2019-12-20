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
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';

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

  mantenimientoModel = new Mantenimiento();

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
      sistemaId: new FormControl('', [Validators.required]),
      fechaDesde: new FormControl('', [Validators.required]),
      horaDesde: new FormControl('', [Validators.required]),
      fechaHasta: new FormControl('', [Validators.required]),
      horaHasta: new FormControl('', [Validators.required]),
    });
  }

  get sistemaId() {
    return this.grupoFormulario.get('sistemaId');
  }

  get fechaDesde() {
    return this.grupoFormulario.get('horaDesde');
  }

  get horaDesde() {
    return this.grupoFormulario.get('horaDesde');
  }

  get fechaHasta() {
    return this.grupoFormulario.get('fechaHasta');
  }

  get horaHasta() {
    return this.grupoFormulario.get('horaHasta');
  }

  consultarSistemaCombo() {
    const m = new Sistema();
    m.opcion = 3;
    m.baja = false;
    this.sistemaService.consultarSistemaCombo(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.datosCombo = response.datos;   
          
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

  mostrarValor(obj: Combo) {
    if (obj) return obj.descripcion;
  }

  changeMatToggle(event) {
    this.toggleBaja = event.checked;    
  }

  guardarMantenimiento(m: Mantenimiento)
  {
    if (this.grupoFormulario.valid) {
      this.generalesService.mostrarLoader();
      let [horaDesde, minutoDesde] = this.grupoFormulario.value.horaDesde.split(':');  
      let [horaHasta, minutoHasta] = this.grupoFormulario.value.horaHasta.split(':');      
      const fd =  new Date(this.grupoFormulario.value.fechaDesde);
      const fh =  new Date(this.grupoFormulario.value.fechaHasta);

      fd.setHours(+horaDesde);
      fd.setMinutes(minutoDesde);

      fh.setHours(+horaHasta);
      fh.setMinutes(minutoHasta);
      
      this.esEdicion ? (m.opcion = 3) : (m.opcion = 1);
      if (this.grupoFormulario.value.ventanaMantenimientoId) {
        this.mantenimientoModel.ventanaMantenimientoId = this.grupoFormulario.value.ventanaMantenimientoId;
      }   
      
      this.mantenimientoModel.fechaDesde = fd;
      this.mantenimientoModel.fechaHasta = fh;
      this.mantenimientoModel.baja = !this.toggleBaja;
      this.mantenimientoModel.sistemaId = this.grupoFormulario.value.sistemaId.identificador;
      
      console.log(this.mantenimientoModel);

      this.mantenimientoService.guardarMantenimiento(this.mantenimientoModel, this.esEdicion).subscribe(
        (response: any) => {
          if (response.satisfactorio) {
            this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
            this.mantenimientoService.obtenerFiltros();
            this.mantenimientoService.setearFiltros();
            this.cerrarModal();
          } else {
            this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
          }
        },
        err => {
          this.generalesService.notificar(new NotificacionModel('success', 'Ocurrió un error'));
        },
        () => {
          this.generalesService.quitarLoader();
        }
      );
      
    }
  }

  cerrarModal() {
    this.modal.closeAll();
  }
  
}
