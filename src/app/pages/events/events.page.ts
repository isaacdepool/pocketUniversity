import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController, RouterLinkDelegate } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { DatabaseService } from 'src/app/services/db.service';
import { NavigationExtras } from '@angular/router';
import { event } from 'src/app/interfaces/interfaces';
import { NotiService } from 'src/app/services/noti.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  event: event[] = [];
  opt;
  boo: boolean = true;
  hoy: Date = new Date(); 

  
  constructor( private popoverCtrl: PopoverController,
               private db: DatabaseService,
               private alertCtrl: AlertController,
               private navCtrl: NavController,
               private notiSvc: NotiService) { }

  ngOnInit() {
    
    this.db.getDatabaseState().subscribe( bo => {
      if(bo){
        this.db.getEvento().subscribe( event => {
            this.event = event;   
            // console.log(event);
                    
        });
      }
    });

  }

  ionViewDidEnter(){
   
  }

  async opts( event, id ){

    const popover = await this.popoverCtrl.create({
     component: PopoverComponent,
     cssClass: 'css_popover',
     event: event,
     mode: 'ios'
    });

    await popover.present();

    const { data } =
    
    await popover.onDidDismiss();

    if(data){

    this.opt = data.item;



    this.optEvento(id);
  }

  }

  d(){
    this.notiSvc.clearNoti(1);
  }

  optEvento(id){

    if( this.opt === 'eliminar'){
      this.eliminarEvento(id);

    }else if( this.opt === 'editar'){
      this.editar(id)
    }
  }

  editar(id){
    let materiaId = 0; 
    this.db.cargarMateriaEvento(id).then( data =>{
          materiaId = data[0].id; 

          if(materiaId > 0){
    
              let navigationExtras: NavigationExtras = { state: { id: materiaId, boo: this.boo} };
              this.navCtrl.navigateForward(['/agg-materia'], navigationExtras);
            }         
            
          }).catch( _ =>{
            if(materiaId == 0){
              let navigationExtras: NavigationExtras = { state: { id: id, boo: this.boo} };
              this.navCtrl.navigateForward(['/agg-evento'], navigationExtras).catch( err => console.log(err)
              )}
          })
          
  }

   async eliminarEvento( id: number ){
      
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar este evento?',
      // message: 'Se eliminara el evento.',
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
            text: 'Eliminar',
            handler: (blah) => {
              this.db.eliminarEvento(id);

              this.notiSvc.clearNoti(id);
            }
          }
      ]
    });

    await alert.present();
    
  }

}
