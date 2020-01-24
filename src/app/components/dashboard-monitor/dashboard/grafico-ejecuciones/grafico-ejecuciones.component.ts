import { Component, OnInit } from '@angular/core';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { labelToGraphics, getStepSize } from 'src/app/extensions/utils/utils';
import Chart from 'chart.js';

@Component({
  selector: 'app-grafico-ejecuciones',
  templateUrl: './grafico-ejecuciones.component.html',
  styleUrls: ['./grafico-ejecuciones.component.scss']
})
export class GraficoEjecucionesComponent implements OnInit {

  chart;

  stepSize = 1;

  // Excepciones
  registrosExcepciones: number;
  dataEjecuciones: number[] = [];
  labelEjecuciones: string[] = [];

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

    this.dashboardService.consultarGraficoEjecuciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          
          this.dataEjecuciones = [];
          this.labelEjecuciones = [];
          // if (this.registrosExcepciones > 0) {
            for (const I in response.datos) {
              const label = labelToGraphics(response.datos[I].fechaOcurrencia);
              this.dataEjecuciones.push(response.datos[I].cantidad);
              this.labelEjecuciones.push(label);
            }

            this.stepSize = getStepSize(this.dataEjecuciones);

            this.chart = new Chart('graficoEjecuciones', {
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
                labels: this.labelEjecuciones,
                datasets: [
                  {
                    type: 'line',
                    label: 'Ejecuciones',
                    data: this.dataEjecuciones,
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
