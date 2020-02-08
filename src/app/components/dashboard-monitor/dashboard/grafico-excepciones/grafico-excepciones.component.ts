import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { Chart } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { Excepcion } from 'src/app/models/dashboard-monitor/excepcion';
import { log } from 'util';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import moment from 'moment';
import { labelToGraphics, getStepSize } from 'src/app/extensions/utils/utils';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FiltrosExcepcion } from 'src/app/models/dashboard-monitor/filtros-excepcion';
import { ExcepcionesService } from 'src/app/services/dashboard-monitor/excepciones.service';

@Component({
  selector: 'app-grafico-excepciones',
  templateUrl: './grafico-excepciones.component.html',
  styleUrls: ['./grafico-excepciones.component.scss']
})
export class GraficoExcepcionesComponent implements OnDestroy, OnInit {
  
  chart;

  stepSize = 1;

  // Excepciones
  registrosExcepciones: number;
  dataExcepciones: number[] = [];
  labelsExcepciones: string[] = [];

  subs: Subscription;

  constructor(private dashboardService: DashboardService,
    private router: Router,
    private generalesService: GeneralesService,
    private excepcionesService: ExcepcionesService) { }

  ngOnInit() {
    this.subs = this.dashboardService.filtros.subscribe((m: any) => {
      this.consultarGraficoExcepciones(m);

    });
    this.dashboardService.obtenerFiltros();

  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();      
    } 
  }

  consultarGraficoExcepciones(m: FiltrosDashboard) {

    this.dashboardService.consultarGraficoExcepciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          
          this.dataExcepciones = [];
          this.labelsExcepciones = [];
          // if (this.registrosExcepciones > 0) {
            for (const I in response.datos) {
              const label = labelToGraphics(response.datos[I].fechaOcurrencia);
              this.dataExcepciones.push(response.datos[I].cantidad);
              this.labelsExcepciones.push(label);
            }

            this.stepSize = getStepSize(this.dataExcepciones);

            this.chart = new Chart('graficoExcepciones', {
              type: 'bar',
              options: {
                responsive: true,
                title: {
                  display: false,
                  text: 'BITÁCORA DE EXCEPCIONES'
                },
                scales: {
                  yAxes: [{
                     ticks: {
                        stepSize: this.stepSize
                     }
                  }]
               }                
              },
              data: {
                labels: this.labelsExcepciones,
                datasets: [
                  {
                    type: 'line',
                    label: 'Excepciones',
                    data: this.dataExcepciones,
                    backgroundColor: '#ff3300',
                    borderColor: '#ff3300',
                    borderWidth: 1,
                    fill: false
                  }
                ]
              }
            });

          // } else {

          // }

        } else {
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de excepciones ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de excepciones ${err.statusText} ${err.message}`));
      },
      () => {
      }
    );

  }

  irBitacora(){
    const excepcion = new FiltrosExcepcion();
    const fD = JSON.parse(localStorage.getItem('filtrosDashboard'));
    excepcion.opcion = 4;
    excepcion.excepcionId = 0;
    excepcion.sistemaId = fD.sistemaId;
    excepcion.sistemaDescripcion = fD.sistemaDescripcion;
    excepcion.excepcionEstatusId = 1;
    excepcion.excepcionEstatusDescripcion = 'Abierta';
    excepcion.fechaDesde = fD.fechaDesde;
    excepcion.fechaHasta = fD.fechaHasta;
    excepcion.sistemaBaja = false;
    localStorage.setItem('filtrosExcepcion', JSON.stringify(excepcion));
    this.excepcionesService.setearFiltros();
    this.excepcionesService.obtenerFiltros();
    this.router.navigate(['site/excepciones']);
  }
}
