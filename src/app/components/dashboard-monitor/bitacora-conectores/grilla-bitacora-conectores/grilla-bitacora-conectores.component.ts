import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Conector } from 'src/app/models/dashboard-monitor/conector';
import { Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';
import { ConectoresService } from 'src/app/services/dashboard-monitor/conectores.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { Router } from '@angular/router';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';
import { FiltrosConector } from 'src/app/models/dashboard-monitor/filtros-conector';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-grilla-bitacora-conectores',
  templateUrl: './grilla-bitacora-conectores.component.html',
  styleUrls: ['./grilla-bitacora-conectores.component.scss']
})
export class GrillaBitacoraConectoresComponent implements AfterViewInit, OnDestroy, OnInit {
  dtOptions: any = {};
  listadoBitacora: Conector[] = [];
  dtTrigger: Subject<Conector> = new Subject();
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  subscripcion: Subscription;
  // sistemaModel = new Sistema();

  loadingTrue = true;
  loadingConfig = CONFIG_LOADING;
  verTabla = false;

  constructor(
    private conectoresService: ConectoresService,
    private generalesService: GeneralesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION
    this.subscripcion = this.conectoresService.filtros.subscribe((m: any) => {
      this.obtenerBitacoras(m);
    });
    this.conectoresService.obtenerFiltros();
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

  obtenerBitacoras(m: FiltrosConector) {
    this.conectoresService.consultarConectores(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.verTabla = false;
          this.listadoBitacora = response.datos;
          console.log(response);

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
            new NotificacionModel('warning', `Error al consultar el listado de conectores. ${response.mensaje}`)
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

  verDetalle(conectorId){
    this.router.navigate(['site/monitoreo', conectorId]);
  }

}
