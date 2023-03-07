import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService } from './data.service';
import { DatabaseService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor( private alertCtrl: AlertController,
               private dataSvc: DataService,
               private db: DatabaseService,
               private toastCtrl: ToastController) {  }


    async presentToast( message: string ) {
      const toast = await this.toastCtrl.create({
        cssClass:"alert",
        message,
        duration: 2000,
        // position: 'middle'
      });
      toast.present();
    }



}
