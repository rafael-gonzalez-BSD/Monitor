import { Component, OnInit, ViewChild, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ConectorDetalle } from 'src/app/models/dashboard-monitor/conector-detalle';
import { Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { FiltrosConectorDetalle } from 'src/app/models/dashboard-monitor/filtros-conector-detalle';
import { ConectorDetalleService } from 'src/app/services/dashboard-monitor/conector-detalle.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { GeneralesService } from 'src/app/services/general/generales.service';

@Component({
  selector: 'app-grilla-detalle-conectores',
  templateUrl: './grilla-detalle-conectores.component.html',
  styleUrls: ['./grilla-detalle-conectores.component.scss']
})
export class GrillaDetalleConectoresComponent implements  AfterViewInit, OnDestroy, OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('conectorId') conectorId: number;

  dtOptions: any = {};
  listadoBitacora: ConectorDetalle[] = [];
  dtTrigger: Subject<[ConectorDetalle]> = new Subject();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  subscripcion: Subscription;

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  constructor(private conectorDetalleService: ConectorDetalleService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    const M = new FiltrosConectorDetalle();
    M.conectorId = this.conectorId;
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

  obtenerBitacoras(m: FiltrosConectorDetalle) {
    this.conectorDetalleService.consultarConectorDetalles(m).subscribe(
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
            new NotificacionModel('warning', `Error al consultar el listado de ConectoresDetalle ${response.mensaje}`)
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
