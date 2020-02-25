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
  dataEjecuciones: number[] = [];
  labelEjecuciones: string[] = [];
  subs: Subscription;

  loadingConfig = CONFIG_LOADING;
  verGrafico = false;

  constructor(
    private dashboardService: DashboardService,
    private generalesService: GeneralesService,
    private router: Router,
    private ejecucionesService: EjecucionesService) { }

  ngOnInit() {
    this.subs = this.dashboardService.filtrosGraficoEjecuciones.subscribe((m: any) => {
      this.consultarGraficoEjecuciones(m);
    });

    this.dashboardService.obtenerFiltrosGraficoEjecuciones();
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();      
    } 
  }

  consultarGraficoEjecuciones(m: FiltrosDashboard) {
    this.dashboardService.consultarGraficoEjecuciones(m).subscribe(
      (response: any) => {
        if (response.satisfactorio) {
          this.registrosExcepciones = response.datos.length;
          
          this.dataEjecuciones = [];
          this.labelEjecuciones = [];
            for (const I in response.datos) {
              const label = labelToGraphics(response.datos[I].fechaOcurrencia);
              this.dataEjecuciones.push(response.datos[I].cantidad);
              this.labelEjecuciones.push(label);
            }

            // test
            // this.dataEjecuciones = [12, 69, 45, 150, 23, 87, 56, 200, 167];
            // this.labelEjecuciones = ['Sep 3', 'Sep 4', 'Sep 5', 'Sep 7', 'Sep 8', 'Sep 23', 'Sep 25', 'Sep 29', 'Sep 30'];

            this.stepSize = getStepSize(this.dataEjecuciones);

            this.chart = new Chart('graficoEjecuciones', {
              type: 'bar',
              options: {
                responsive: true,
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
                    data: this.dataEjecuciones,
                    backgroundColor: '#ff3300',
                    borderColor: '#ff3300',
                    borderWidth: 1,
                    fill: false
                  }
                ]
              }
            });
        } else {
          this.generalesService.notificar(
            new NotificacionModel('warning', `Error al consultar el listado de ejecuciones ${response.mensaje}`)
          );
        }
      },
      err => {
        this.generalesService.notificar(new NotificacionModel('warning', `Ocurrió un error al consultar el listado de ejecuciones ${err.statusText} ${err.message}`));
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
