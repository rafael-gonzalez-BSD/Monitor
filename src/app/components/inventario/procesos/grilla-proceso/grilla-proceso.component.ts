import { ProcesoService } from './../../../../services/inventario/proceso.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Proceso } from 'src/app/models/inventario/proceso';
import { ModalGuardarProcesoComponent } from '../modal-guardar-proceso/modal-guardar-proceso.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RespuestaModel } from '../../../../models/base/respuesta';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { map } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';

@Component({
  selector: 'app-grilla-proceso',
  templateUrl: './grilla-proceso.component.html',
  styleUrls: ['./grilla-proceso.component.scss']
})
export class GrillaProcesoComponent implements AfterViewInit, OnDestroy, OnInit {
  // DataTable
  dtOptions: any = {};
  listadoProcesos: Proceso[] = [];
  dtTrigger: Subject<Proceso> = new Subject();
  paginar = false;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  procesosSubs: Subscription;


  procesoModel = new Proceso();
  length: number;  


  constructor(
    private procesoService: ProcesoService,
    private generalesService: GeneralesService,
    private modal: MatDialog) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    this.procesosSubs = this.procesoService.filtros.subscribe((m: any) => {
      this.obtenerProcesos(m);
    });
    this.procesoService.obtenerFiltros();
    this.procesoService.setearFiltros();
  }

  ngAfterViewInit(){
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    if (this.procesosSubs) {
      this.procesosSubs.unsubscribe();      
    }    
  }

  rerender(): void {
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  obtenerProcesos(m: Proceso) {
    this.generalesService.mostrarLoader();
    this.procesoService.obtenerProcesos(m).subscribe(
      (response: RespuestaModel) => {
        if (response.satisfactorio) {
          this.listadoProcesos = response.datos;
          this.length = response.datos.length;

          // Validamos si debemos paginar o no
          // tslint:disable-next-line: radix
          const tamanioPaginar = parseInt(localStorage.getItem('tamanioPaginar'));
          if(this.length > tamanioPaginar) 
          {
            this.dtOptions.paging = true;
            this.dtOptions.info = true;
          }          
          this.rerender();
        } else {
          new NotificacionModel('warning', `Error al consultar el listado de procesos ${response.mensaje}`)
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de procesos'));
      },
      () => {
        this.generalesService.quitarLoader();
      }
    );
  }

  consultarProcesoId(id: number) {
    const m = new Proceso();
    m.opcion = 4;
    m.procesoId = id;

    this.procesoService.obtenerProcesos(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          if (res.datos.length > 0) {
            this.abrirModalEditar(res.datos[0]);        
          }else{
            this.generalesService.notificar(new NotificacionModel('warning', `No se encontró el registro`));
          }

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar sistemas por Id ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Error al consultar sistemas por Id'));
      },
      () => {
      }
    );
  }

  abrirModalEditar(datosEditar: any) {
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.edit = true;
    CONFIG_MODAL.data.opcion = 3;
    CONFIG_MODAL.data.tituloModal = 'Editar Proceso';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(datosEditar));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarProcesoComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nuevo Proceso',
      edit: false,
      opcion: 1
    };
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '70%';
    dialogConfig.maxWidth = '768px';
    this.modal.open(ModalGuardarProcesoComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.procesoModel.opcion = 4;
    this.procesoModel.procesoId = row.procesoId;
    this.procesoModel.baja = !e['checked'];

    this.procesoService.actualizarEstado(this.procesoModel).subscribe(
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
