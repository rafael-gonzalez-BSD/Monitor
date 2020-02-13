import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Ejecucion } from 'src/app/models/dashboard-monitor/ejecucion';
import { Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { EjecucionesService } from 'src/app/services/dashboard-monitor/ejecuciones.service';
import { Router } from '@angular/router';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-grilla-bitacora-ejecuciones',
  templateUrl: './grilla-bitacora-ejecuciones.component.html',
  styleUrls: ['./grilla-bitacora-ejecuciones.component.scss']
})
export class GrillaBitacoraEjecucionesComponent implements AfterViewInit, OnDestroy, OnInit {
  dtOptions: any = {};
  listadoBitacora: Ejecucion[] = [];
  dtTrigger: Subject<Ejecucion> = new Subject();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  subscripcion: Subscription;
  // sistemaModel = new Sistema();

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  constructor(
    private ejecucionesService: EjecucionesService,
    private generalesService: GeneralesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    this.subscripcion = this.ejecucionesService.filtros.subscribe((m: any) => {
      this.obtenerBitacoras(m);
    });
    this.ejecucionesService.obtenerFiltros();
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

  obtenerBitacoras(m: Ejecucion) {
    this.ejecucionesService.consultarEjecuciones(m).subscribe(
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
            new NotificacionModel('warning', `Error al consultar el listado de ejecuciones. ${response.mensaje}`)
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

  verDetalle(ejecucionId){
    this.router.navigate(['site/ejecuciones', ejecucionId]);
  }
}
