import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-grafico-excepciones',
  templateUrl: './grafico-excepciones.component.html',
  styleUrls: ['./grafico-excepciones.component.scss']
})
export class GraficoExcepcionesComponent implements OnInit {
  chart;

  stepSize = 1;

  // Excepciones
  registrosExcepciones: number;
  dataExcepciones: number[] = [];
  labelsExcepciones: string[] = [];

  constructor(private dashboardService: DashboardService,
    private generalesService: GeneralesService) { }

  ngOnInit() {
    this.dashboardService.filtros.subscribe((m: any) => {

      const ARRAY = m.fechaOcurrenciaCorta.split('/');
      m.fechaOcurrencia = `${ARRAY[1]}/${ARRAY[0]}/01`;
      this.consultarGraficoExcepciones(m);

    });

    this.dashboardService.obtenerFiltros();

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
            new NotificacionModel('warning', `Error al consultar el listado de sistemas. ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de sistemas. ${err.statusText} ${err.message}`));
      },
      () => {
      }
    );

  }

}
