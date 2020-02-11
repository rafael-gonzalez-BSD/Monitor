import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { ExcepcionDetalle } from 'src/app/models/dashboard-monitor/excepcion-detalle';
import { Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';
import { ExcepcionDetalleService } from 'src/app/services/dashboard-monitor/excepcion-detalle.service';
import { FiltrosExcepcionDetalle } from 'src/app/models/dashboard-monitor/filtros-excepcion-detalle';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ModalLogExcepcionesComponent } from '../modal-log-excepciones/modal-log-excepciones.component';

@Component({
  selector: 'app-grilla-detalle-excepciones',
  templateUrl: './grilla-detalle-excepciones.component.html',
  styleUrls: ['./grilla-detalle-excepciones.component.scss']
})
export class GrillaDetalleExcepcionesComponent implements AfterViewInit, OnDestroy, OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('excepcionId') excepcionId: number;

  dtOptions: any = {};
  listadoBitacora: ExcepcionDetalle[] = [];
  dtTrigger: Subject<ExcepcionDetalle> = new Subject();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  subscripcion: Subscription;

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;
  generalesService: any;

  constructor(
    private excepcionDetalleService: ExcepcionDetalleService,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    const M = new FiltrosExcepcionDetalle();
    M.excepcionId = this.excepcionId;
    this.obtenerBitacoras(M);
  }

  ngAfterViewInit(){
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();      
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

  obtenerBitacoras(m: FiltrosExcepcionDetalle) {
    this.excepcionDetalleService.consultarExcepcionDetalles(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.verTabla = false;
          this.listadoBitacora = response.datos;
          console.log(this.listadoBitacora);

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
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de ExcepcionesDetalle ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Error de conexión`));
      },
      () => {
        
      }
    );
  }

  verDetalle(excepcionDetalleId: number){
    console.log(excepcionDetalleId);
  }

  abrirModalLog(datosLog: any){
    const CONFIG_MODAL = new MatDialogConfig();
    CONFIG_MODAL.data = datosLog;
    CONFIG_MODAL.data.tituloModal = 'Log';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(CONFIG_MODAL.data));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalLogExcepcionesComponent, CONFIG_MODAL);

  }

}
