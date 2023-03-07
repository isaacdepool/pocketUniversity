import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, NavController, AlertController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { DatabaseService } from 'src/app/services/db.service';
import { cuaderno, materia } from 'src/app/interfaces/interfaces';
import { AlertasService } from 'src/app/services/alertas.service';
import * as moment from 'moment';
import { ArchivosService } from 'src/app/services/archivos.service';
import { PopoverArchivosComponent } from 'src/app/components/popover-archivos/popover-archivos.component';

@Component({
  selector: 'app-cuaderno-id',
  templateUrl: './cuaderno-id.page.html',
  styleUrls: ['./cuaderno-id.page.scss'],
})
export class CuadernoIdPage implements OnInit {

  fechaHoy: Date = new Date();

  opt;
  dataArchi: {} = {};
  valid: boolean = false;
  idCuaderno: number;
  idMateria: number;

  dataCuaderno: cuaderno;
  dataMateria: materia;

  modelCuaderno = {
    nombreMateria: '',
    titulo: '',
    fecha_mod: this.fechaHoy.toISOString(),
    fecha_crea: '',
    contenido: '',
  }

  modelArchivo =
    { 
    array: [],
    id_usuario: 1,
    id_cuaderno: 0
    };

  @ViewChild('text') textarea: { setFocus: () => void; };

                    constructor( private popoverCtrl: PopoverController,
                                 private activatedRoute: ActivatedRoute,
                                 private db: DatabaseService,
                                 private alerta: AlertasService,
                                 private navCtrl: NavController,
                                 private alertCtrl: AlertController,
                                 private alertSvc: AlertasService,
                                 private archivosSvc: ArchivosService,
                                  ) { 

                                    this.activatedRoute.params.subscribe( params => {

                                      this.idCuaderno = params['idC'];
                                      this.idMateria = params['idM'];
                                      
                                    })
                                  }

        ngOnInit() {
                
            this.db.getDatabaseState().subscribe( boo => {

              if(boo && this.idCuaderno > 0 && this.idMateria > 0){
              
              // Cargar Cuaderno 
                this.db.cargarCuadernoId(this.idCuaderno).then( data =>{
                
                this.dataCuaderno = data;


                this.valid = true;
                
                
              });

              // Cargar Materias
              this.db.cargarMateriaId(this.idMateria).then( data =>{
                this.dataMateria = data;

                
                
              }).then( _ =>{
                  this.modelCuaderno = {
                    nombreMateria: this.dataMateria.nombre,
                    titulo: this.dataCuaderno.titulo,
                    fecha_crea: this.dataCuaderno.fecha_crea,
                    fecha_mod: this.fechaHoy.toISOString(),
                    contenido: this.dataCuaderno.contenido,
                  }
              }); 
              

              this.db.cargarArchivosCuaderno(this.idCuaderno).then( data =>{
                  this.modelArchivo.array = data;
                  console.log(this.modelArchivo.array);
                   
                  
              });
                
            }
              
            });

  }

  async archivos( event ){
    
    this.dataArchi = [{ nombre: 'Cargar Archivos'}];
    const popover = await this.popoverCtrl.create({
      component: PopoverArchivosComponent,
      cssClass: 'css_popover',
      event: event,
      mode: 'ios',
      componentProps: {
       opt: this.dataArchi
      }
    });
 
    await popover.present(); 

    const { data } = 
    
    await popover.onDidDismiss();
    
  if(data){
      this.opt = data.item;
  
      this.cargarArchivo();
    
  }

  }
 
  cargarArchivo(){

    if(this.opt === 'Cargar Archivos'){

      this.archivosSvc.cargar().then( url =>{
      this.guardarArchivo(url).then( _ =>{
        this.alertSvc.presentToast('Archivo agregado con exito');
      })
            .catch( _ => this.alertSvc.presentToast('No se cargo ningun archivo'))
      });
    
    }
  }

 async guardarArchivo(url){

    
   this.archivosSvc.copyFile(url);   
    let nombre = url.substr(url.lastIndexOf('/') + 1);

    let items = {
      nombre: nombre,
      url: url
    }
    
    this.modelArchivo.array.push(items); 

        this.db.agregarArchivos( url, 
                                 nombre,
                                 this.modelArchivo.id_usuario,
                                 this.idCuaderno);

    
      
  }

  async selectArchivo(event){

    if(this.modelArchivo.array.length > 0){

    this.dataArchi = this.modelArchivo.array;
  }else this.dataArchi = [{ nombre: 'Sin Archivos'}];

    const popover = await this.popoverCtrl.create({
      component: PopoverArchivosComponent,
      cssClass: 'css_popover',
      event: event,
      mode: 'ios',
      translucent: false,
      componentProps: {
        opt: this.dataArchi
       }
    });
  
    await popover.present();

    const { data } = 

    await popover.onDidDismiss();

    if(data){

    this.abrirArchivo(data);
    
    }
  
}

async abrirArchivo(data){
  
  
    
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: data.item,
      backdropDismiss: false,
      buttons: [
          {
            text: 'Abrir',
            handler: (blah) => {
               this.archivosSvc.open(data.url);
            }
          },
          {
            text: 'Eliminar',
            handler: (blah) => {
              console.log(this.idCuaderno);
              
              if(this.idCuaderno > 0 && this.idMateria > 0){
                
                for( let i=0; i<this.modelArchivo.array.length; i++){

                  if( data.item === this.modelArchivo.array[i].nombre ){

                    this.db.eliminarArchivo(this.modelArchivo.array[i].id).then( _ =>{

                      this.modelArchivo.array.splice(i, 1);
                    });

                  }
                }

              }else{
                for( let i=0; i<this.modelArchivo.array.length; i++){

                  if( data.item === this.modelArchivo.array[i].nombre ){

                    this.modelArchivo.array.splice(i, 1);

                  }
                }
                  
              }

              this.alertSvc.presentToast('Archivo eliminado');

            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              for( let i=0; i<this.modelArchivo.array.length; i++){

                console.log(this.modelArchivo.array[i].nombre);

              }
              
            }
          }
      ]
    });

    await alert.present(); 

  }

removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}
 
// removeItemFromArr( foo, 'picture-1' );
// console.info( foo );
// // ["thumb-1", "thumb-2", "thumb-3", "thumb-4"]
 
// removeItemFromArr( foo, 'thumb-2' );
// console.info( foo );
// // ["thumb-1", "thumb-3", "thumb-4"]



guardar(){

  this.modelCuaderno.contenido = this.modelCuaderno.contenido.trim();    
  this.modelCuaderno.titulo = this.modelCuaderno.titulo.trim();
  
  
  
  if( (this.modelCuaderno.contenido.length == 0) && (this.modelCuaderno.titulo.length == 0) ){
        this.alerta.presentToast("Sin datos que guardar. No se ha creado la nota");
        this.navCtrl.back();

        
  }else if(!this.valid){
          
          this.valid = !this.valid;
          this.db.agregarCuaderno( this.modelCuaderno.titulo,
            this.modelCuaderno.fecha_mod,
            this.modelCuaderno.fecha_mod,
            this.modelCuaderno.contenido,
            this.idMateria).then( data =>{
              this.idCuaderno = data;

              if(this.modelArchivo.array.length > 0){
                for( let archi of this.modelArchivo.array){
          
                  this.db.agregarArchivos( archi['url'], 
                                           archi['nombre'],
                                           this.modelArchivo.id_usuario,
                                           this.idCuaderno);
          
                                      
                }
              }
              
            });
 
            
            this.alerta.presentToast('Datos guardados con exito');
            this.navCtrl.back();
            
          }else{
            
            this.valid = !this.valid;
            this.db.updateCuaderno( this.idCuaderno,
              this.modelCuaderno.titulo,
              this.modelCuaderno.fecha_crea,
              this.modelCuaderno.fecha_mod,
              this.modelCuaderno.contenido,
              this.idMateria);

              // if(this.modelArchivo.array.length > 0){
              //   for( let i=0; i<this.modelArchivo.array.length; i++){

              //     console.log(this.modelArchivo.array);
                  
  
              //     this.db.updateArchivo( this.modelArchivo.array[i].nombre,
              //                            this.modelArchivo.array[i].url,
              //                            this.idCuaderno);
              //   }
              // }
              
              
              
              this.alerta.presentToast('Datos guardados con exito');
              this.navCtrl.back();
              
            }

  }

  focus(){

    this.textarea.setFocus();

  }

  async eliminar(){
    
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar esta nota?',
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
            text: 'Eliminar nota',
            handler: (blah) => {
              if(this.valid){
               this.db.eliminarCuaderno(this.idCuaderno).then( _ =>{

                  this.db.eliminarArchivoCuaderno(this.idCuaderno).then( _ =>{

                    this.alertSvc.presentToast("Nota eliminada con exito");
                    this.navCtrl.back(); 
                    this.valid = !this.valid;

                  }).catch(err => console.log(err));
               }).catch(err => err);

              }else{
               this.alertSvc.presentToast("No se ha creado la nota");
               this.navCtrl.back();
              } 

            }
          }
      ]
    });

    await alert.present(); 

  }
  

}
