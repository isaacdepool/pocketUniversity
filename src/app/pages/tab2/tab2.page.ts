import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/db.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { NavController } from '@ionic/angular';
import { IonSegment } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  
  @ViewChild(IonSegment) segment: IonSegment;

  now = new Date();

  icosele ='';
value = '';
listo = true;
coma = 0;
id_gasto = 0;
descrip = '';

// tslint:disable-next-line:max-line-length
icon = [{icono:'shirt', nom: 'Ropa' },
{icono:'fast-food',nom: 'Comida' },
{icono:'book',nom: 'Universidad' }, 
{icono:'wallet',nom: 'Deudas' }, 
{icono:'shuffle',nom: 'Otros' }];


  numeros = [
     [7, 8, 9],
     [4, 5, 6],
     [1, 2, 3],
     [',', 0, 'C']
    ];
  disabled = false;
  disabled2 = false;


    cambioCategoria( event ){

      // this.noticias = [];
      
     this.segment.value = event.detail.value; 

      }

  numbers(num){
    
  if (num === '.'){
    this.disabled = true;
  }
  if (num === 'borrar'){

    this.value = this.value.substring(0, this.value.length - 1);
    
    if (this.value.indexOf(',')){
      this.disabled = false;
    }

}else{
if (this.listo){
  this.value = '' +  num;
}else{
  this.value += '' +  num;
}
this.listo = false;

}


if (num === 'C'){
  this.value = '0';
  this.listo = true;
  this.disabled2 = false;
  this.disabled = false;
  this.coma = 0;
  this.descrip = '';
}


  }

  constructor( private db: DatabaseService,
               private alerta: AlertasService,
               private navCtrl: NavController) { }

               ionViewDidEnter(){

                this.segment.value = this.icon[0].nom;
                
                }

  ngOnInit() {
  }

  ingresarGasto(){
  
switch( this.segment.value){

  case 'Ropa': { 
   this.icosele = 'shirt';
    break; 
 } 
 case 'Universidad': { 
  this.icosele = 'book';
    break; 
 } 
 case 'Comida': { 
  this.icosele = 'fast-food';
    break; 
 } 
 case 'Deudas': { 
  this.icosele = 'wallet';
    break; 
 } 
 case 'Otros': { 
  this.icosele = 'shuffle';
    break; 
 } 
 default: { 
    //statements; 
    break; 
 } 
}
      if (parseFloat(this.value) > 0){
    
        // Agregar Gasto 
        

        this.db.agregarGasto( this.value,
                              this.segment.value, 
                              this.descrip,
                              this.now.toISOString(),
                              this.icosele,
                               1).then( _ =>{
                                this.alerta.presentToast('Datos guardados con exito');
                                this.navCtrl.back();

                              }).catch( err => this.alerta.presentToast(err) ).finally();

       
    
      }else {

        this.alerta.presentToast('Ingrese un monto');
       
      }
    
    
    
  }


}
