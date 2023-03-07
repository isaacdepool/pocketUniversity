import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController, AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/db.service';
import { carpeta, fotos, materia } from 'src/app/interfaces/interfaces';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ImagenModalPage } from '../imagen-modal/imagen-modal.page';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { InfoModalPage } from '../info-modal/info-modal.page';
import { AlertasService } from 'src/app/services/alertas.service';
import { GaleriaService } from 'src/app/services/galeria.service';

@Component({
  selector: 'app-carpeta-id',
  templateUrl: './carpeta-id.page.html',
  styleUrls: ['./carpeta-id.page.scss'],
})
export class CarpetaIdPage implements OnInit {

  @Input() carpetaId;
  @Input() fotoId;
  @Input() fav = false;


  dataCarpeta: carpeta;
  dataMateria: materia;
  dataFotos: fotos [] = [];
  imgUrl: any[] = [];
  isFavorite: number[] = [];
  ver = false;

  

  constructor( private modalCtrl: ModalController,
               private db: DatabaseService,
               private webView: WebView,
               private popoverCtrl: PopoverController,
               private alertCtrl: AlertController,
               private alertSvc: AlertasService,
               private galeriaSvc: GaleriaService,
               private navCtrl: NavController) { }

  ngOnInit() {

    
  }

  ionViewWillEnter(){
    
    if(this.fav){
      this.cargarFavoritos();
    }else this.cargar();
    
  }

  

  cargar(){
    this.db.getDatabaseState().subscribe( boo =>{
      if(boo){
        this.db.cargarCarpetaId(this.carpetaId).then(data =>{
          this.dataCarpeta = data;  
          
          if(data.id_materia > 0){
          this.db.cargarMateriaId(data.id_materia).then( data =>{
            this.dataMateria = data;
          });
        }     
        });

        this.db.getFotos().subscribe( data =>{
          let i = 0;
          this.dataFotos = [];
          this.imgUrl = [];
          for(let fotos of data){
            
            if(fotos.id_carpeta == this.carpetaId){   
              
              this.dataFotos.push(fotos);
              this.isFavorite[i] = fotos.favorito; 
              this.imgUrl[i] = this.webView.convertFileSrc(fotos.url);
              i++;
              
            }
          }
          
        });

      }
      return setTimeout(() => {
        this.ver = true;
      }, 200);
    });
  }

  cargarFavoritos(){
    this.db.getFotos().subscribe( data =>{
      let i = 0;
          this.dataFotos = [];
          this.imgUrl = [];
          for(let fotos of data){

            
            
            if(fotos.favorito == 1){   
              console.log(data);
              
              this.dataFotos.push(fotos);
              this.isFavorite[i] = fotos.favorito; 
              this.imgUrl[i] = this.webView.convertFileSrc(fotos.url);
              i++;
              
            }
          }

          return setTimeout(() => {
            this.ver = true;
          }, 200);
    });
  }

  async img(event, id, index){
    
    const modal = await this.modalCtrl.create({
      component: ImagenModalPage,
      componentProps: {
        id: id,
        index: index,
        dataFotos: this.dataFotos,
        imgUrl: this.imgUrl,
        isFavorite: this.isFavorite
      }
    });

    await modal.present();
  }

 async opts(){

  let itemsC = 
      {
      nombre: 'info',
      icon: 'alert-circle'
      } 

  let boo = true;
  
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      cssClass: 'css_popover',
      event: event,
      mode: 'ios',
      componentProps: {
        itemsC: itemsC,
        boo: boo,
      }
    });
    await popover.present();

    const { data } = 
    
    await popover.onDidDismiss();
    
  if(data){
    
    if(data.item === 'info'){
      this.info();
    }

    if(data.item === 'editar'){
      this.editar();
    }

    if(data.item === 'eliminar'){
      this.eliminar();
    }
    
  }
  }

async info(){
  const modal = await this.modalCtrl.create({
    component: InfoModalPage,
    componentProps: {
      tipo: 'carpeta',
      id: this.carpetaId
    }
  });
  await modal.present();
}


  salir(){
    this.modalCtrl.dismiss();
  }

  async editar(){
    if( this.dataCarpeta.id_materia != 0){
      this.restringido();
    }else{
    const alert =  await this.alertCtrl.create({
      header: 'Editar carpeta',
      backdropDismiss: false,
      cssClass: 'alert-css',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: this.dataCarpeta.nombre
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
            this.db.updateCarpetaLibre(this.carpetaId, data.nombre)
                .then ( _ =>{
                  this.ionViewWillEnter();
                  this.alertSvc.presentToast("Datos actualizados correctamente");
                });
              }else this.alertSvc.presentToast("Debes ingresar un titulo");
          }
        }
      ]
    }); 
    await alert.present();
    }
  }

 async restringido(){
    const alert = await this.alertCtrl.create({
      header: 'Editar carpeta',
      message: 'Esta caperta pertece a una materia, si quieres editarla tienes que hacerlo desde \'Editar materia\'',
      backdropDismiss: false,
      cssClass: 'alert-css',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Editar materia',
          handler: () =>{ 
            this.modalCtrl.dismiss({
              idMateria: this.dataMateria.id,
              editarMateria: true
            })
            
          }
        }
      ]
    });
    await alert.present();
  }
  
 async eliminar(){
   const alert = await this.alertCtrl.create({
    header: '¿Quieres eliminar esta carpeta?',
    message: 'Se eliminaran todas las imagenes',
    backdropDismiss: false,
    cssClass: 'alert-css',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        handler: () =>{
          this.db.eliminarCarpeta(this.carpetaId);
          this.db.getFotos().subscribe(data =>{
            for( let dat of data){
              if(dat.id_carpeta == this.carpetaId ){
                this.galeriaSvc.deleteFileRoot(dat.url, dat.nombre);
                this.galeriaSvc.deleteFileGaleria(dat.nombre);
              }
            }
          });
          this.db.eliminarFotosCarpeta(this.carpetaId);
          this.alertSvc.presentToast('Carpeta eliminada con exito');
          this.modalCtrl.dismiss();
        }
      }
    ]
   });
   await alert.present();
  }



}


