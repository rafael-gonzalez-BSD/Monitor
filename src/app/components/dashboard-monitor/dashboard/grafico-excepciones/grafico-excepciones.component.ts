import { Component, OnInit } from '@angular/core';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import {Chart} from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { Excepcion } from 'src/app/models/dashboard-monitor/excepcion';
import { log } from 'util';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';

@Component({
  selector: 'app-grafico-excepciones',
  templateUrl: './grafico-excepciones.component.html',
  styleUrls: ['./grafico-excepciones.component.scss']
})
export class GraficoExcepcionesComponent implements OnInit {
  chart;
  loader = false;
  registrosExcepciones: number;

  constructor(private dashboardService: DashboardService,
    private generalesService: GeneralesService) { }

  ngOnInit() {

    this.dashboardService.filtros.subscribe((m: any) => {
      
      const ARRAY  = m.fechaOcurrenciaCorta.split('/');
      m.fechaOcurrencia = `${ARRAY[1]}/${ARRAY[0]}/01`;
      

      delete m.sistemaDescripcion;
      delete m.sistemaId;
      delete m.fechaOcurrenciaCorta;

      console.log(m);

      this.consultarGraficoExcepciones(m);
    });

    this.dashboardService.obtenerFiltros();
    this.dashboardService.setearFiltros();
    // this.chart = new Chart('bar', {
    //   type: 'bar',
    //   options: {
    //     responsive: true,
    //     title: {
    //       display: false,
    //       text: 'BITÁCORA DE EXCEPCIONES'
    //     },
    //   },
    //   data: {
    //     labels: ['Ene 1','Ene 2', 'Ene 3', 'Ene 4', 'Ene 7', 'Ene 9', 'Ene 17', 'Ene 23', 'Ene 24', 'Ene 30',
    //     'Ene 1','Ene 2', 'Ene 3', 'Ene 4', 'Ene 7', 'Ene 9', 'Ene 17', 'Ene 23', 'Ene 24', 'Ene 30'],
    //     datasets: [
    //       {
    //         type: 'line',
    //         label: 'Excepciones',
    //         data: [324, 243, 156, 50, 456, 30, 156, 265, 356, 300, 324, 243, 156, 50, 456, 30, 156, 265, 356, 300],
    //         backgroundColor: '#ff3300',
    //         borderColor: '#ff3300',
    //         borderWidth: 1,
    //         fill: false
    //       }
    //     ]
    //   }
    // });
  }

  consultarGraficoExcepciones(m: FiltrosDashboard){

    this.dashboardService.consultarGraficoExcepciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          console.log(response);
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
        this.loader = false;
      }
    );

  }

}
