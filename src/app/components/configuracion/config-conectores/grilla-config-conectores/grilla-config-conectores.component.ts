import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ConfigConectores } from 'src/app/models/configuracion/config-conectores';
import { MatTableDataSource, PageEvent, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { ConfigConectoresService } from '../../../../services/configuracion/config-conectores.service';
import { RespuestaModel } from 'src/app/models/base/respuesta';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { ModalGuardarConfigConectoresComponent } from '../modal-guardar-config-conectores/modal-guardar-config-conectores.component';
import { map } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CONFIGURACION } from 'src/app/extensions/dataTable/dataTable';

@Component({
  selector: 'app-grilla-config-conectores',
  templateUrl: './grilla-config-conectores.component.html',
  styleUrls: ['./grilla-config-conectores.component.scss']
})
export class GrillaConfigConectoresComponent implements AfterViewInit, OnDestroy, OnInit {
  // DataTable
  dtOptions: any = {};
  listadoConfiguConectores: ConfigConectores[] = [];
  dtTrigger: Subject<ConfigConectores> = new Subject();
  paginar = false;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  configConectoresSubs: Subscription;
  configConectoresModel = new ConfigConectores();
  length: number;

  constructor(
    private generalesService: GeneralesService,
    private configConectoresService: ConfigConectoresService,
    private modal: MatDialog
  ) { }

  ngOnInit() {
    this.dtOptions = CONFIGURACION;
    this.configConectoresSubs = this.configConectoresService.filtros.subscribe((m: any) => {
      this.obtenerConfigConectores(m);
    });
    this.configConectoresService.obtenerFiltros();
    this.configConectoresService.setearFiltros();
  }

  ngAfterViewInit(){
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    if (this.configConectoresSubs) {
      this.configConectoresSubs.unsubscribe();      
    }    
  }

  rerender() {
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  obtenerConfigConectores(m: ConfigConectores) {
    this.generalesService.mostrarLoader();
    this.configConectoresService.obtenerConfigConectores(m).subscribe(
      (response: RespuestaModel) => {
        if (response.satisfactorio) {
          this.listadoConfiguConectores = response.datos;
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
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar el listado de configuraciones de conectores. ${response.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Ocurrió un error al consultar el listado de configuraciones de conectores'));
        this.generalesService.quitarLoader();
      },
      () => {
        this.generalesService.quitarLoader();
      }
    );
  }

  consultarConfigConectoresId(id: number) {
    const m = new ConfigConectores();
    m.opcion = 4;
    m.conectorConfiguracionId = id;

    this.configConectoresService.obtenerConfigConectores(m).subscribe(
      (res: RespuestaModel) => {
        if (res.satisfactorio) {
          if (res.datos.length > 0) {
            this.abrirModalEditar(res.datos[0]);        
          }else{
            this.generalesService.notificar(new NotificacionModel('warning', `No se encontró el registro`));
          }

        } else {
          this.generalesService.notificar(new NotificacionModel('warning', `Error al consultar configuracion de conectores por Id ${res.mensaje}`));
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('error', 'Error al consultar configuracion de conectores por Id'));
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
    CONFIG_MODAL.data.tituloModal = 'Editar Conector';
    CONFIG_MODAL.data = JSON.parse(JSON.stringify(CONFIG_MODAL.data));
    CONFIG_MODAL.height = 'auto';
    CONFIG_MODAL.width = '90%';
    CONFIG_MODAL.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigConectoresComponent, CONFIG_MODAL);
  }

  abrirModalGuardar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      tituloModal: 'Nuevo Conector',
      edit: false,
      opcion: 1
    };
    dialogConfig.data.horaDesde = '';
    dialogConfig.data.horaHasta = '';
    dialogConfig.data = JSON.parse(JSON.stringify(dialogConfig.data));
    dialogConfig.height = 'auto';
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '1024px';
    this.modal.open(ModalGuardarConfigConectoresComponent, dialogConfig);
  }

  actualizarEstado(e: Event, row) {
    this.configConectoresModel.opcion = 3;
    this.configConectoresModel.conectorConfiguracionId = row.conectorConfiguracionId;
    this.configConectoresModel.baja = !e['checked'];

    this.configConectoresService.actualizarEstado(this.configConectoresModel).subscribe(
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
