import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificacionModel } from 'src/app/models/base/notificacion';
import { DashboardService } from 'src/app/services/dashboard-monitor/dashboard.service';
import { GeneralesService } from 'src/app/services/general/generales.service';
import { FiltrosDashboard } from 'src/app/models/dashboard-monitor/filtrosDashboard';
import { labelToGraphics, getStepSize } from 'src/app/extensions/utils/utils';
import Chart from 'chart.js';
import { FiltrosExcepcion } from 'src/app/models/dashboard-monitor/filtros-excepcion';
import { Router } from '@angular/router';
import { FiltrosEjecucion } from 'src/app/models/dashboard-monitor/filtros-ejecucion';
import { EjecucionesService } from 'src/app/services/dashboard-monitor/ejecuciones.service';
import { Subscription } from 'rxjs';
import { CONFIG_LOADING } from 'src/app/extensions/loading/loading';

@Component({
  selector: 'app-grafico-ejecuciones',
  templateUrl: './grafico-ejecuciones.component.html',
  styleUrls: ['./grafico-ejecuciones.component.scss']
})
export class GraficoEjecucionesComponent implements OnInit, OnDestroy { 

  chart;
  stepSize = 1;

  // Excepciones
  registrosExcepciones: number;
  ejecucionesSerie1: number[] = [];
  labelEjecuciones: string[] = [];

  ejecucionesSerie2: number[] = [];
  ejecucionesSerie3: number[] = [];

  subs: Subscription;

  loadingConfig = CONFIG_LOADING;
  verGrafico = false;

  model: FiltrosDashboard;

  constructor(
    private dashboardService: DashboardService,
    private generalesService: GeneralesService,
    private router: Router,
    private ejecucionesService: EjecucionesService) { }

  ngOnInit() {
    this.subs = this.dashboardService.filtrosGraficoEjecuciones.subscribe((m: any) => {
      this.model = m;
      this.model.opcion = 5;
      this.consultarSerie1(this.model);
    });

    this.dashboardService.obtenerFiltrosGraficoEjecuciones();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();      
    } 
  }

  consultarSerie1(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoEjecuciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          
          this.ejecucionesSerie1 = [];
          this.labelEjecuciones = [];
            for (const I in response.datos) {
              const label = labelToGraphics(response.datos[I].fechaOcurrencia);
              this.ejecucionesSerie1.push(response.datos[I].cantidad);
              this.labelEjecuciones.push(label);
            }
            this.stepSize = getStepSize(this.ejecucionesSerie1);

            
        } else {
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de ejecuciones, serie 1 ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de ejecuciones, serie 1 ${err.statusText} ${err.message}`));
      },
      () => {
        this.model.opcion = 6;
        this.consultarSerie2(this.model);
      }
    );
  }

  consultarSerie2(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoEjecuciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          
          this.ejecucionesSerie2 = [];
            for (const I in response.datos) {
              this.ejecucionesSerie2.push(response.datos[I].cantidad);
            }

            
        } else {
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de ejecuciones, serie 2 ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de ejecuciones, serie 2 ${err.statusText} ${err.message}`));
      },
      () => {
        this.model.opcion = 7;
        this.consultarSerie3(this.model);
      }
    );
  }

  consultarSerie3(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoEjecuciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          
          this.ejecucionesSerie3 = [];
            for (const I in response.datos) {
              this.ejecucionesSerie3.push(response.datos[I].cantidad);
            }
            
            if (this.chart !== undefined) {
              this.chart.destroy();
            }

            this.chart = new Chart('graficoEjecuciones', {
              type: 'bar',
              options: {
                responsive: true,
                aspectRatio: 1.2,
                title: {
                  display: false,
                  text: 'BITÁCORA DE EJECUCIONES'
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
                    data: this.ejecucionesSerie1,
                    backgroundColor: '#7b7b7b',
                    borderColor: '#7b7b7b',
                    borderWidth: 1,
                    fill: false
                  },
                  {
                    type: 'line',
                    label: 'Alertas',
                    data: this.ejecucionesSerie2,
                    backgroundColor: '#F09603',
                    borderColor: '#F09603',
                    borderWidth: 1,
                    fill: false
                  },
                  {
                    type: 'line',
                    label: 'Excepciones',
                    data: this.ejecucionesSerie3,
                    backgroundColor: '#F30',
                    borderColor: '#F30',
                    borderWidth: 1,
                    fill: false
                  }
                ]
              }
            });
        } else {
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de ejecuciones, serie 3 ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de ejecuciones, serie 3 ${err.statusText} ${err.message}`));
      },
      () => {
        this.verGrafico = true;
      }
    );
  }

  irBitacora(){
    const ejec = new FiltrosEjecucion();
    const fD = JSON.parse(localStorage.getItem('filtrosDashboard'));
    ejec.opcion = 4;
    ejec.sistemaId = fD.sistemaId;
    ejec.sistemaDescripcion = fD.sistemaDescripcion
    ejec.procesoId = 0;
    ejec.procesoDescripcion = '';
    ejec.fechaDesde = fD.fechaDesde;
    ejec.fechaHasta = fD.fechaHasta;
    localStorage.setItem('filtrosEjecucion', JSON.stringify(ejec));
    this.ejecucionesService.setearFiltros();
    this.ejecucionesService.obtenerFiltros();
    this.router.navigate(['site/ejecuciones']);
  }

}
