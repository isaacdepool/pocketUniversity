import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { DatabaseService } from 'src/app/services/db.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  gasto = 0;
  dataGasto: any[] = [];
  comida= 0;
  ropa = 0;
  uni= 0;
  deudas = 0;
  otros = 0;

  totalGastado = 0;
  condecimales = 0;

  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef;

  private doughnutChart: Chart;

  constructor(private db: DatabaseService) { 
  }

  ionViewWillEnter(){

    this.db.getDatabaseState().subscribe( boo => {
      if (boo){
        this.db.getGasto().subscribe( data => {
          

    this.gasto= 0;
    this.uni = 0;
    this.ropa = 0;
    this.comida = 0;
    this.otros = 0;
    this.totalGastado = 0;
    this.condecimales = 0;
          for (const ga of data) {

            this.totalGastado += ga.gasto;
            this.condecimales = parseFloat(this.totalGastado.toFixed(2)); 
            this.gasto = parseFloat(ga.gasto);
          
            switch (ga.tipo_gasto) {
              case 'Ropa': { 
             this.ropa = this.ropa + ga.gasto;
             break; 
              } 
              case 'Universidad': { 
            this.uni = this.uni + this.gasto;
            break; 
              } 
              case 'Comida': { 
            this.comida = this.comida + this.gasto;
                 break; 
              } 
              case 'Deudas': { 
               this.deudas = this.deudas + this.gasto;
               break; 
              } 
              case 'Otros': { 
            this.otros = this.otros + this.gasto;
            break; 
              } 
              default: {
                 break; 
              } 
            }
           
          }
          this.gasto= 0;
        });
        
      }
    });

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ropa', 'Comida', 'Universidad', 'Deudas', 'Otros'],
        datasets: [
          {
            label: '# of Votes',
            data: [parseFloat(this.ropa.toFixed(2)), parseFloat(this.comida.toFixed(2)), parseFloat(this.uni.toFixed(2)), parseFloat(this.deudas.toFixed(2)), parseFloat(this.otros.toFixed(2))],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#b81fff',
              '#1ff0ff'
            ],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '##b81fff', '#1ff0ff']
          }
        ]
      }
    });
  }


  ngOnInit() {

  }
  
  }

 