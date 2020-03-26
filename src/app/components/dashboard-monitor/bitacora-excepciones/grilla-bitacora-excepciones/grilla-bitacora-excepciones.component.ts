import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Excepcion } from 'src/app/models/dashboard-monitor/excepcion';
import { Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grilla-bitacora-excepciones',
  templateUrl: './grilla-bitacora-excepciones.component.html',
  styleUrls: ['./grilla-bitacora-excepciones.component.scss']
})
export class GrillaBitacoraExcepcionesComponent implements AfterViewInit, OnDestroy, OnInit {
  dtOptions: any = {};
  listadoBitacora: Excepcion[] = [];
  dtTrigger: Subject<Excepcion> = new Subject();
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  subscripcion: Subscription;
  // sistemaModel = new Sistema();

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  constructor(
    private excepcionesService: ExcepcionesService,
    private generalesService: GeneralesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    this.subscripcion = this.excepcionesService.filtros.subscribe((m: any) => {
      this.obtenerBitacoras(m);
    });
    this.excepcionesService.obtenerFiltros();
    this.excepcionesService.setearFiltros();
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

  obtenerBitacoras(m: Excepcion) {
    this.excepcionesService.consultarExcepciones(m).subscribe(
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
  
  verDetalle(excepcionId){
    this.router.navigate(['site/excepciones', excepcionId]);
  }
}
