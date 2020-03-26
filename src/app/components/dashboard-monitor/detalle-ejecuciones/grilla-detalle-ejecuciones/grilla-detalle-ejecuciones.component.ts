import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EjecucionDetalleService } from 'src/app/services/dashboard-monitor/ejecucion-detalle.service';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { FiltrosEjecucionDetalle } from 'src/app/models/dashboard-monitor/filtros-ejecucion-detalle';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { EjecucionDetalle } from 'src/app/models/dashboard-monitor/ejecucion-detalle';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-grilla-detalle-ejecuciones',
  templateUrl: './grilla-detalle-ejecuciones.component.html',
  styleUrls: ['./grilla-detalle-ejecuciones.component.scss']
})
export class GrillaDetalleEjecucionesComponent implements AfterViewInit, OnDestroy, OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('ejecucionId') ejecucionId: number;

  dtOptions: any = {};
  listadoBitacora: EjecucionDetalle[] = [];
  dtTrigger: Subject<[EjecucionDetalle]> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  subscripcion: Subscription;

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  constructor(
    private ejecucionDetalleService: EjecucionDetalleService,
    private modal: MatDialog,
    private generalesService: GeneralesService,
  ) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    const M = new FiltrosEjecucionDetalle();
    M.ejecucionId = this.ejecucionId;
    M.opcion = 4;
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

  obtenerBitacoras(m: FiltrosEjecucionDetalle) {
    this.ejecucionDetalleService.consultarExcepcionDetalles(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.verTabla = false;
          this.listadoBitacora = response.datos;

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
}
