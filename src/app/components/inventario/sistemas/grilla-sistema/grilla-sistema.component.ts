import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SistemaService } from '../../../../services/inventario/sistema.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sistema } from '../../../../models/inventario/sistema';
import { ModalGuardarSistemaComponent } from '../modal-guardar-sistema/modal-guardar-sistema.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GeneralesService } from '../../../../services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { map } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { getConfigDataTable } from 'src/app/extensions/dataTable/dataTable';

@Component({
  selector: 'app-grilla-sistema',
  templateUrl: './grilla-sistema.component.html',
  styleUrls: ['./grilla-sistema.component.scss']
})
export class GrillaSistemaComponent implements AfterViewInit, OnDestroy, OnInit {

  // DataTable
  dtOptions: any = {};
  listadoSistemas: Sistema[] = [];
  dtTrigger: Subject<Sistema> = new Subject();
  paginar = false;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  sistemasSubs: Subscription;


  sistemaModel = new Sistema();
  length: number;

  constructor(private sistemaService: SistemaService, private generalesService: GeneralesService, private modal: MatDialog) { }

  ngOnInit() {
    this.dtOptions = getConfigDataTable();
    this.sistemasSubs = this.sistemaService.filtros.subscribe((m: any) => {
      if (m.baja === null) delete m.baja;
      this.consultarSistemaAll(m);
    });
    this.sistemaService.obtenerFiltros();
    this.sistemaService.setearFiltros();
  }

  ngAfterViewInit(){
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    if (this.sistemasSubs) {
      this.sistemasSubs.unsubscribe();      
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

  consultarSistemaAll(m: Sistema) {
    this.generalesService.mostrarLoader();
    this.sistemaService.consultarSistemaAll(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          console.log(response.datos);
          this.listadoSistemas = response.datos;
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
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de sistemas. ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de sistemas. ${err.statusText} ${err.message}`));
      },
      () => {
        this.generalesService.quitarLoader();
      }
    );
  }

  consultarSistemaId(id: number) {
    const m = new Sistema();
    m.opcion = 4;
    m.sistemaId = id;

    this.sistemaService.consultarSistemaAll(m).subscribe(
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

  abrirModalEditar(datosEditar: any){
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosEditar;
    CONFIG_MODAL.data.insercion = false;
    CONFIG_MODAL.data.tituloModal = 'Editar Sistema';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(CONFIG_MODAL.data));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarSistemaComponent, CONFIG_MODAL);

  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      insercion: true,
      tituloModal: 'Nuevo Sistema',
      gerenciaId: '-1'
    };
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarSistemaComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.sistemaModel.opcion = 4;
    this.sistemaModel.sistemaId = row.sistemaId;
    this.sistemaModel.baja = !e['checked'];

    this.sistemaService.actualizarEstado(this.sistemaModel).subscribe(
      (response: any) => {
        this.generalesService.notificar(new NotificacionModel('success', response.mensaje));
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', `Ocurrió un error.  ${err}`));
      },
      () => { }
    );
  }
}
