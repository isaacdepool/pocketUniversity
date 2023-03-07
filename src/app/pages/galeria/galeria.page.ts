import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/db.service';
import { PopoverController, AlertController, ModalController, NavController } from '@ionic/angular';
import { PopoverOptionsComponent } from 'src/app/components/popover-options/popover-options.component';
import { fotos } from 'src/app/interfaces/interfaces';
import { CarpetaIdPage } from '../carpeta-id/carpeta-id.page';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NavigationExtras } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  fotos: fotos [] = [];
  carpeta = [];
  opt;
  textoBuscar = '';
  img: any[] = [];
  ver = false;

  constructor( private db: DatabaseService,
               private popoverCtrl: PopoverController,
               private webView: WebView,
               private alertCtrl: AlertController,
               private modalCtrl: ModalController,
               private navCtrl: NavController,
               private alertSvc: AlertasService,
               ) { 

               }
   
              
              
  ngOnInit() { 
  }

  ionViewWillEnter(){
    
    this.cargar();
  }
    
   
          

  cargar(){
   this.db.getDatabaseState().subscribe( boo =>{
      if(boo){
            
        this.db.getFotos().subscribe( data =>{
          this.fotos = [];
          this.img = [];
          
          for (let [i,foto] of data.entries()){
            this.fotos.push(foto);
            this.img[i] = this.webView.convertFileSrc(foto.url);
          }
          this.fotos = this.fotos.slice().reverse();
          this.img = this.img.slice().reverse();
              });

                this.db.getCarpeta().subscribe( data =>{
                 this.carpeta = data;

               });
                
              }
              
            });  
            return setTimeout(() => {
              this.ver = true;
            }, 200);       
  }

          
async verCarpeta( id_Carpeta, id_foto ){
  
  const modal = await this.modalCtrl.create({
    component: CarpetaIdPage,
    componentProps: {
    carpetaId: id_Carpeta,
    fotoId: id_foto
    }
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();
  
  if(data){
    if(data.editarMateria == true){
      
      let navigationExtras: NavigationExtras = { state: { id: data.idMateria, boo: true } };
      this.navCtrl.navigateForward(['/agg-materia'], navigationExtras);
    }
  }
}

async verFavorito(){
  
  const modalFav = await this.modalCtrl.create({
    component: CarpetaIdPage,
    componentProps: {
    fav: true
    }
  });

  await modalFav.present();
  
}


onClick(){
  
  this.db.getDatabaseState().subscribe( boo =>{

    if(boo){
      this.db.getFotos().subscribe( data =>{
        
      })
    }
  });
}

buscar( event ){ 
  
  this.textoBuscar = event.detail.value;
  
}

async opts( event ){

  const popover = await this.popoverCtrl.create({
   component: PopoverOptionsComponent,
   cssClass: 'css_popover',
   event: event,
   mode: 'ios'
  });

  await popover.present();

  const { data } =
  
  await popover.onDidDismiss();

  if(data){

  this.opt = data.item;
  


  this.optsCarpeta();
  if(this.opt === "Crear carpeta"){
  }

}
}

async optsCarpeta(){
  const alert =  await this.alertCtrl.create({
    header: 'Nueva carpeta',
    backdropDismiss: false,
    cssClass: 'alert-css',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre de la carpeta'
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: (blah) =>{

        }
      },
      {
        text:'Guardar',
        handler: (data) =>{
          data.nombre = data.nombre.trim();
          if(data.nombre.length > 0){
          this.crearCarpeta(data.nombre);

          }else{
            this.alertSvc.presentToast("La carpeta no se pudo crear. Debe colocar un nombre");
          }
        }
      }
    ]
  });
  await alert.present();
}

crearCarpeta(nombre){
  this.db.agregarCarpeta(nombre, 1, 0).then( _ =>{

  });
}


}
