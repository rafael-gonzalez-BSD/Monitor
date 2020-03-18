import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import Chart from 'chart.js';
import { getStepSize, labelToGraphics } from 'src/app/extensions/utils/utils';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { FiltrosConector } from 'src/app/models/dashboard-monitor/filtros-conector';
import { ConectoresService } from 'src/app/services/dashboard-monitor/conectores.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';

@Component({
  selector: 'app-grafico-conectores',
  templateUrl: './grafico-conectores.component.html',
  styleUrls: ['./grafico-conectores.component.scss']
})
export class GraficoConectoresComponent implements OnInit, OnDestroy {
  chart;

  stepSize = 1;

  // Excepciones
  registrosConectores: number;
  conectoresSerie1: number[] = [];
  labelSerie1: string[] = [];

  conectoresSerie2: number[] = [];
  labelSerie2: string[] = [];

  conectoresSerie3: number[] = [];
  labelSerie3: string[] = [];

  subs: Subscription;

  loadingConfig = CONFIG_LOADING;
  verGrafico = false;

  model: FiltrosDashboard;

  constructor(
    private dashboardService: DashboardService,
    private generalesService: GeneralesService,
    private conectoresService: ConectoresService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subs = this.dashboardService.filtrosGraficoConectores.subscribe(
      (m: any) => {
        this.model = m;
        this.model.opcion = 5;
        this.consultarSerie1(this.model);
      }
    );
    this.dashboardService.obtenerFiltrosGraficoConectores();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  consultarSerie1(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoConectores(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosConectores = response.datos.length;

          this.conectoresSerie1 = [];
          this.labelSerie1 = [];
          for (const I in response.datos) {
            const label = labelToGraphics(response.datos[I].fechaOcurrencia);
            this.conectoresSerie1.push(response.datos[I].cantidad);
            this.labelSerie1.push(label);
          }

          this.stepSize = getStepSize(this.conectoresSerie1);


        } else {
          this.generalesService.notificar(
            new NotificacionModel(
              'warning',
              `Error al consultar el listado de conectores, serie 1 ${response.mensaje}`
            )
          );
        }
      },
      err => {
        this.generalesService.notificar(
          new NotificacionModel(
            'warning',
            `Ocurrió un error al consultar el listado de conectores, serie 1 ${err.statusText} ${err.message}`
          )
        );
      },
      () => {
        this.model.opcion = 6;
        this.consultarSerie2(this.model);
      }
    );
  }

  consultarSerie2(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoConectores(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosConectores = response.datos.length;

          this.conectoresSerie2 = [];
          this.labelSerie2 = [];
          for (const I in response.datos) {
            const label = labelToGraphics(response.datos[I].fechaOcurrencia);
            this.conectoresSerie2.push(response.datos[I].cantidad);
            this.labelSerie2.push(label);

          }

        } else {
          this.generalesService.notificar(
            new NotificacionModel(
              'warning',
              `Error al consultar el listado de conectores, serie 2 ${response.mensaje}`
            )
          );
        }
      },
      err => {
        this.generalesService.notificar(
          new NotificacionModel(
            'warning',
            `Ocurrió un error al consultar el listado de conectores, serie 2 ${err.statusText} ${err.message}`
          )
        );
      },
      () => {
        this.model.opcion = 7;
        this.consultarSerie3(this.model);
      }
    );
  }

  consultarSerie3(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoConectores(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosConectores = response.datos.length;

          this.conectoresSerie3 = [];
          this.labelSerie3 = [];
          for (const I in response.datos) {
            const label = labelToGraphics(response.datos[I].fechaOcurrencia);
            this.conectoresSerie3.push(response.datos[I].cantidad);
            this.labelSerie3.push(label);
          }
          console.log(this.conectoresSerie1);
          console.log(this.conectoresSerie2);
          console.log(this.conectoresSerie3);

          if (this.chart !== undefined) {
            this.chart.destroy();
          }

          // this.chart = new Chart('graficoConectores', {
          //   type: 'bar',
          //   options: {
          //     responsive: true,
          //     aspectRatio: 1.2,
          //     title: {
          //       display: false,
          //       text: 'BITÁCORA DE MONITOREO'
          //     },
          //     scales: {
          //       yAxes: [
          //         {
          //           ticks: {
          //             stepSize: this.stepSize
          //           },
          //           stacked: false
          //         }
          //       ]
          //     }
          //   },
          //   data: {
          //     labels: this.labelSerie1,
          //     datasets: [
          //       {
          //         type: 'line',
          //         label: 'Conectores',
          //         data: [
          //           {
          //             x: 'mar. 9',
          //             y: 20
          //           }, 
          //           {
          //             x: 'mar. 12',
          //             y: 10
          //           },
          //           {
          //             x: 'mar. 14',
          //             y: 45
          //           }
          //         ],
          //         backgroundColor: '#7b7b7b',
          //         borderColor: '#7b7b7b',
          //         borderWidth: 1,
          //         fill: false
          //       }

          //     ]
          //   }
          // });
        } else {
          this.generalesService.notificar(
            new NotificacionModel(
              'warning',
              `Error al consultar el listado de conectores, serie 3 ${response.mensaje}`
            )
          );
        }
      },
      err => {
        this.generalesService.notificar(
          new NotificacionModel(
            'warning',
            `Ocurrió un error al consultar el listado de conectores, serie 3 ${err.statusText} ${err.message}`
          )
        );
      },
      () => {
        this.verGrafico = true;
      }
    );
  }

  irBitacora() {
    const CONEC = new FiltrosConector();
    const fD = JSON.parse(localStorage.getItem('filtrosDashboard'));
    CONEC.opcion = 4;
    CONEC.sistemaId = fD.sistemaId;
    CONEC.sistemaDescripcion = fD.sistemaDescripcion;
    CONEC.fechaDesde = fD.fechaDesde;
    CONEC.fechaHasta = fD.fechaHasta;
    localStorage.setItem('filtrosConector', JSON.stringify(CONEC));
    this.conectoresService.setearFiltros();
    this.conectoresService.obtenerFiltros();
    this.router.navigate(['site/monitoreo']);
  }
}
