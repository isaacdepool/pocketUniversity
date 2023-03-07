import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fotos } from 'src/app/interfaces/interfaces';
import { DatabaseService } from 'src/app/services/db.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { AlertController, ModalController, IonSlides } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InfoModalPage } from '../info-modal/info-modal.page';
import { GaleriaService } from 'src/app/services/galeria.service';

@Component({
  selector: 'app-imagen-modal',
  templateUrl: './imagen-modal.page.html',
  styleUrls: ['./imagen-modal.page.scss'],
})
export class ImagenModalPage implements OnInit {

  @Input() id;
  @Input() index;
  @Input() imgUrl;
  @Input() dataFotos: fotos[];
  @Input() isFavorite: number[] = [];


  @ViewChild('slider') slider: IonSlides;

  opts = true;
  isAlbuma = true;
  ver = false;
  fotoIdSelect: number;
  indexO: number;
  indexSlider: number;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };


  constructor( private db: DatabaseService,
               private alertSvc: AlertasService,
               private alertCtrl: AlertController,
               private socialSharing: SocialSharing,
               private modalCtrl: ModalController,
               private galeriaSvc: GaleriaService) { }

  ngOnInit(){

    this.slideOpts.initialSlide = this.index;
    this.indexO = this.index;
    this.fotoIdSelect = this.id;
  }

  ionViewWillEnter() {

   

  }

  ionViewWillLeave(){

    // for( let [i, idx] of this.isFavorite.entries() )
    // this.db.updateFotosFav(this.dataFotos[i].id, idx)
    // .then( _ =>{
      
    //   // this.clear();

    // })
  }

  verOpts(id, index){
    
    this.fotoIdSelect = id;
    this.indexO = index;

    if(this.opts == false){
      this.opts = false;

    setTimeout(() => {
      this.opts = true;
    }, 4000);
  }else  {
    this.opts = false;
    setTimeout(() => {
      this.opts = true;
    }, 4000);

  }
  }

  async eliminarFoto(){
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar esta imagen?',
      backdropDismiss: false, 

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () =>{

          }
        },
        {
          text: 'Eliminar',
          role: 'ok',
          handler: () =>{
            
            for( let fotos of this.dataFotos){
              if( fotos.id == this.fotoIdSelect ){

                this.galeriaSvc.deleteFileGaleria(fotos.nombre);
                this.galeriaSvc.deleteFileRoot(fotos.url, fotos.nombre);
              }
            }
            this.db.eliminarFotos(this.fotoIdSelect).then( _ =>{
              this.ver = !this.ver;
              this.modalCtrl.dismiss();
              this.isAlbuma = !this.isAlbuma;
              this.alertSvc.presentToast("Imagen eliminada con exito");
              this.opts = true;
            });
          }
        }
      ]
    });

    await alert.present();
    
  }

  favorite(){

    if(this.isFavorite[this.indexSlider] == 0 ){
      this.isFavorite[this.indexSlider] = 1;
    }else this.isFavorite[this.indexSlider] = 0;

    this.dataFotos[this.indexSlider].favorito = this.isFavorite[this.indexSlider];
    
    for( let [i, idx] of this.isFavorite.entries() )
    this.db.updateFotosFav(this.dataFotos[i].id, idx)
    .then( _ =>{
      
      // this.clear();

    })
    
    

  }

  cambio(){

      this.slider.getActiveIndex().then(data =>{
        this.indexSlider = data;
        this.fotoIdSelect = this.dataFotos[this.indexSlider].id;

        
        
      });
    
  }

  compartir(){
    
    this.socialSharing.share(
      'hola',
      'como estas',
      this.dataFotos[this.indexO].url
    ).catch( err => console.log(err)
    )
  }

  async info(){
    const modal = await this.modalCtrl.create({
      component: InfoModalPage,
      componentProps: {
        tipo: 'imagenCarpeta',
        id: this.fotoIdSelect,
        editarMateria: false
      }
    });
    await modal.present();
    
     
      
  }

  clear(){

  this.id = '';
  this.index = '';
  this.imgUrl = '';
  this.dataFotos= [];
  this.isFavorite= [];

  this.opts = true;
  this.isAlbuma = true;
  this.ver = false;
  this.fotoIdSelect = 0;
  this.indexO = 0;
  this.indexSlider = 0;

  this.slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  }



  salir(){
    this.modalCtrl.dismiss();
  }


}
