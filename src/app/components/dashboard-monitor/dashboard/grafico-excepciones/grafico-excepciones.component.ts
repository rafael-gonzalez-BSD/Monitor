import { Component, OnInit } from '@angular/core';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-grafico-excepciones',
  templateUrl: './grafico-excepciones.component.html',
  styleUrls: ['./grafico-excepciones.component.scss']
})
export class GraficoExcepcionesComponent implements OnInit {
  chart;
  loader = false;

  constructor() { }

  ngOnInit() {
    this.chart = new Chart('bar', {
      type: 'bar',
      options: {
        responsive: true,
        title: {
          display: false,
          text: 'BITÁCORA DE EXCEPCIONES'
        },
      },
      data: {
        labels: ['Ene 1','Ene 2', 'Ene 3', 'Ene 4', 'Ene 7', 'Ene 9', 'Ene 17', 'Ene 23', 'Ene 24', 'Ene 30',
        'Ene 1','Ene 2', 'Ene 3', 'Ene 4', 'Ene 7', 'Ene 9', 'Ene 17', 'Ene 23', 'Ene 24', 'Ene 30'],
        datasets: [
          {
            type: 'line',
            label: 'Excepciones',
            data: [324, 243, 156, 50, 456, 30, 156, 265, 356, 300, 324, 243, 156, 50, 456, 30, 156, 265, 356, 300],
            backgroundColor: '#ff3300',
            borderColor: '#ff3300',
            borderWidth: 1,
            fill: false
          }
        ]
      }
    });
  }

}
