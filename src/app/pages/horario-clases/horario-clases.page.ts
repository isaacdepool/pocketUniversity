import { Component, OnInit, ViewChild} from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { event } from 'src/app/interfaces/interfaces';
import { AlertasService } from 'src/app/services/alertas.service';
import { DatabaseService } from 'src/app/services/db.service';
import * as moment from 'moment';

@Component({
  selector: 'app-horario-clases',
  templateUrl: './horario-clases.page.html',
  styleUrls: ['./horario-clases.page.scss'],
})
export class HorarioClasesPage implements OnInit {

  dataEvent: event[] = [];
  dataEventM: event[] = [];
  dataEventT: event[] = [];
  dataEventN: event[] = [];
  @ViewChild(IonSegment) segmento: IonSegment; 
  publisher = "";
 
  constructor( private db: DatabaseService,
               private alertSvc: AlertasService) {}
 
  ngOnInit() {
  }

  ionViewDidEnter(){

    this.segmento.value = 'lunes';
    this.dataEventM = [];
    this.dataEventN = [];
    this.dataEventT = [];
    
  this.db.getDatabaseState().subscribe( boo =>{
    if(boo){
      this.db.getEvento().subscribe( data =>{  
        
        this.dataEvent = data;

        for( let dat of data){
          if(moment(dat.fin).format('HH:mm') < moment('1159', 'hmm').format('HH:mm')){

            this.dataEventM.push(dat);


          }else if(moment(dat.fin).format('HH:mm') < moment('1800', 'hmm').format('HH:mm')){

            this.dataEventT.push(dat);


          }else{
            this.dataEventN.push(dat);

          }
        }
          
      });
      
    }
  })  
  }

  segmentChanged(event){
  
      const valorSegment = event.detail.value;
  
      if(valorSegment === 'lunes'){
        this.publisher = 'lunes';
        return
      }
      
      this.publisher = valorSegment;
  
    }
 
 
 
}