import { Component, OnInit } from '@angular/core';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import Chart from 'chart.js';
import { getStepSize, labelToGraphics } from 'src/app/extensions/utils/utils';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { FiltrosConector } from 'src/app/models/dashboard-monitor/filtros-conector';
import { ConectoresService } from 'src/app/services/dashboard-monitor/conectores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grafico-conectores',
  templateUrl: './grafico-conectores.component.html',
  styleUrls: ['./grafico-conectores.component.scss']
})
export class GraficoConectoresComponent implements OnInit {

  chart;

  stepSize = 1;

  // Excepciones
  registrosConectores: number;
  dataConectores: number[] = [];
  labelsConectores: string[] = [];

  constructor(
    private dashboardService: DashboardService,
    private generalesService: GeneralesService,
    private conectoresService: ConectoresService,
    private router: Router
    ) { }

  ngOnInit() {
    this.dashboardService.filtros.subscribe((m: any) => {
      this.consultarGraficoExcepciones(m);

    });

    this.dashboardService.obtenerFiltros();

  }

  consultarGraficoExcepciones(m: FiltrosDashboard) {

    this.dashboardService.consultarGraficoConectores(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosConectores = response.datos.length;
          
          this.dataConectores = [];
          this.labelsConectores = [];
          // if (this.registrosConectores > 0) {
            for (const I in response.datos) {
              const label = labelToGraphics(response.datos[I].fechaDesde);
              this.dataConectores.push(response.datos[I].cantidad);
              this.labelsConectores.push(label);
            }

            this.stepSize = getStepSize(this.dataConectores);

            this.chart = new Chart('graficoConectores', {
              type: 'bar',
              options: {
                responsive: true,
                title: {
                  display: false,
                  text: 'BITÁCORA DE MONITOREO'
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
                labels: this.labelsConectores,
                datasets: [
                  {
                    type: 'line',
                    label: 'Conectores',
                    data: this.dataConectores,
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
            new NotificacionModel('warning', `Error al consultar el listado de conectores ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de conectores ${err.statusText} ${err.message}`));
      },
      () => {
      }
    );

  }

  irBitacora(){
    const CONEC = new FiltrosConector();
    const fD = JSON.parse(localStorage.getItem('filtrosDashboard'));
    CONEC.opcion = 4;
    CONEC.sistemaId = fD.sistemaId;
    CONEC.sistemaDescripcion = fD.sistemaDescripcion
    CONEC.fechaDesde = fD.fechaDesde;
    CONEC.fechaHasta = fD.fechaHasta;
    localStorage.setItem('filtrosConector', JSON.stringify(CONEC));
    this.conectoresService.setearFiltros();
    this.conectoresService.obtenerFiltros();
    this.router.navigate(['site/monitoreo']);
  }

}
