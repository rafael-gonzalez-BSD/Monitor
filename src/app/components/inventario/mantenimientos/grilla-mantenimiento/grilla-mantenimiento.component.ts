import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig, PageEvent } from '@angular/material';
import { Mantenimiento } from '../../../../models/inventario/mantenimiento';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { MantenimientoService } from '../../../../services/inventario/mantenimiento.service';
import { ModalGuardarMantenimientoComponent } from '../modal-guardar-mantenimiento/modal-guardar-mantenimiento.component';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { map } from 'rxjs/operators';
import { Observable, Subscription, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';

@Component({
  selector: 'app-grilla-mantenimiento',
  templateUrl: './grilla-mantenimiento.component.html',
  styleUrls: ['./grilla-mantenimiento.component.scss']
})
export class GrillaMantenimientoComponent implements AfterViewInit, OnDestroy, OnInit {
  // DataTable
  dtOptions: any = {};
  listadoMantenimientos: Mantenimiento[] = [];
  dtTrigger: Subject<Mantenimiento> = new Subject();
  paginar = false;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  mantenimientosSubs: Subscription;
  mantenimientoModel = new Mantenimiento();

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  constructor(
    private mantenimientoService: MantenimientoService,
    private generalesService: GeneralesService,
    private modal: MatDialog) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION;
    this.mantenimientosSubs = this.mantenimientoService.filtros.subscribe((m: any) => {
      if (m.baja === null) delete m.baja;
      if (m.fechaDesde === null) delete m.fechaDesde;
      if (m.fechaHasta === null) delete m.fechaHasta;
      this.obtenerMantenimientos(m);
    });
    this.mantenimientoService.obtenerFiltros();
    this.mantenimientoService.setearFiltros();
  }

  ngAfterViewInit(){
    this.dtTrigger.next();
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    if (this.mantenimientosSubs) {
      this.mantenimientosSubs.unsubscribe();      
    }    
  }

  rerender() {
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
      setTimeout(() => {
        this.verTabla = true;
      }, 0);
    });
  }

  obtenerMantenimientos(m: Mantenimiento) {
    this.mantenimientoService.obtenerMantenimientos(m).subscribe(
      (response: RespuestaModel) => {
        if (response.satisfactorio) {
          this.verTabla = false;
          this.listadoMantenimientos = response.datos;

          // Validamos si debemos paginar o no
          // tslint:disable-next-line: radix
          const tamanioPaginar = parseInt(localStorage.getItem('tamanioPaginar'));
          if(response.datos.length > tamanioPaginar) 
          {
            this.dtOptions.paging = true;
            this.dtOptions.info = true;
          }else{
            this.dtOptions.paging = false;
            this.dtOptions.info = false;            
          }          
          this.rerender();
          
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el listado de mantenimientos. ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de mantenimientos'));
        alert('Ocurrió un error al consultar el listado de mantenimientos');
      },
      () => {
        this.generalesService.quitarLoader();
      }
    );
  }

  consultarMantenimientoId(id: number) {
    const m = new Mantenimiento();
    m.opcion = 4;
    m.ventanaMantenimientoId = id;

    this.mantenimientoService.obtenerMantenimientos(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          if (res.datos.length > 0) {
            this.abrirModalEditar(res.datos[0]);        
          }else{
            this.generalesService.notificar(new NotificacionModel('warning', `No se encontró el registro`));
          }

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar mantenimientos por Id ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Error al consultar mantenimientos por Id'));
      },
      () => {
        
      }
    );
  }

  abrirModalEditar(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 1;
    CONFIG_MODAL.data.tituloModal = 'Editar Ventana de Mantenimientos';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(datosEditar));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarMantenimientoComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nueva Ventana de Mantenimientos',
      edit: false,
      opcion: 1
    };
    dialogConfig.data.fechaDesde = '';
    dialogConfig.data.fechaHasta = '';
    dialogConfig.data.horaDesde = '';
    dialogConfig.data.horaHasta = '';
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarMantenimientoComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.mantenimientoModel.opcion = 3;
    this.mantenimientoModel.ventanaMantenimientoId = row.ventanaMantenimientoId;
    this.mantenimientoModel.baja = !e['checked'];

    this.mantenimientoService.actualizarEstado(this.mantenimientoModel).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
        } else {
          this.generalesService.notificar(new NotificacionModel('warning', response.mensaje));
        }

      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error.'));
      },
      () => { }
    );
  }
}
