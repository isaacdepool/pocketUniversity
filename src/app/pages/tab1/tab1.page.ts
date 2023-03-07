import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/db.service';
import { AlertController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  myDate: String = new Date().toISOString();
  
  gasto = 0;
  totalgasto = 0;
  condecimales = 0;
  dataGasto: any[] = [];
  gastoactual: any[] = [];
  fechagasto: any[] = [];
  mes = '';
  fe = '';
  monthNames = moment.months();



  constructor(private db: DatabaseService,
              private alertCtrl: AlertController,
              private alertSvc: AlertasService, ) { 
            
                moment.locale('es');
                this.monthNames = moment.months();
                
              }

              ionViewWillEnter(){


                this.cargarGas(moment().format("MMMM-YYYY"));

              }

  ngOnInit() {

  }

  async borrar(id){
      
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar este gasto?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        },
          {
            text: 'Eliminar Gasto',
            handler: (blah) => {
               this.db.eliminarGasto(id);
               
               this.alertSvc.presentToast("Gasto eliminado con exito");
            }
          }
      ]
    });

    await alert.present();
    
  }

  cargarMes( event ){
    let dia = moment(event.detail.value).format("MMMM-YYYY");
    this.cargarGas(dia);
  }

  
  cargarGas( dia ){
       
    this.db.getDatabaseState().subscribe( boo => {
      if (boo){
        this.db.getGasto().subscribe( data => {
          this.limpiarGastos();
          
          
    for (var i = 0; i < data.length; i++) {

            let dataform = moment(data[i].fecha).format("MMMM-YYYY");
 
    if( dataform === dia ) {
      this.dataGasto.push({ 
        descripcion: data[i].descripcion,
        id: data[i].id,
        id_usuario: data[i].id_usuario,
        fecha: data[i].fecha,
        gasto: data[i].gasto, 
        icono: data[i].icono, 
        tipo_gasto: data[i].tipo_gasto,
 
      });

      this.gasto = parseFloat(data[i].gasto);
      this.totalgasto = this.gasto +  this.totalgasto;
      this.condecimales = parseFloat(this.totalgasto.toFixed(2));      

}
    }
        });

  
      }
    });
    
    
  }

 
limpiarGastos(){

  this.gasto = 0;
  this.condecimales = 0;
  this.totalgasto = 0;
  this.dataGasto = [];

}

  



}
