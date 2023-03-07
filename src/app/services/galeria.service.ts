import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { BehaviorSubject} from 'rxjs';
import { DatabaseService } from './db.service';
import { materia, event, carpeta } from '../interfaces/interfaces';
import * as moment from 'moment';
const Media_folder_name = 'Myapp';
const Local_location_name = "file:///storage/emulated/0/"

const Media_folder_name_Galeria = 'Galeria';
const Local_location_name_Galeria = "file:///storage/emulated/0/Myapp/"

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {

  private fileReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  fecha: Date = new Date();
  files = [];
  url_img = new BehaviorSubject([]);

  materias: materia[] = [];
  eventos: event[] = [];
  carpeta: carpeta[] = [];
  full;

  foto = {
    nombre: '',
    url: '',
    fecha: this.fecha,
    id_usuario : 1,
    id_carpeta : 0
  }

  Materia = {
    id_materia: 0,
    dia: '',
    inicio: '',
    fin: ''
  }

  constructor( private file: File,
               private media: Media,
               private mediaCapture: MediaCapture,
               private plt: Platform,
               private db: DatabaseService,
               private alert: AlertController) { 

          
            this.plt.ready().then( () =>{

          // Crear carpeta 
            
            // Raiz 
              let path = this.file.dataDirectory;
              
              this.file.checkDir(path,Media_folder_name_Galeria)
              .then( () =>{
                this.cargarArchivos();
        
              }, err => {
                this.file.createDir(path, Media_folder_name_Galeria, false);
              }
              );
        
            // LOCAL 

            // MyApp
              let path2 = Local_location_name;
              this.file.checkDir(path2,Media_folder_name)
              .then( () =>{
                this.cargarArchivos();
              }, err => {
                this.file.createDir(path2, Media_folder_name, false);
              }
              );

            // Galeria
            let path3 = Local_location_name_Galeria;
              this.file.checkDir(path3,Media_folder_name_Galeria)
              .then( () =>{
              }, err => {
                this.file.createDir(path3, Media_folder_name_Galeria, false);
              }
              );

            this.fileReady.next(true);
            });
                    
      }

getCamera(){
  return this.fileReady.asObservable();
}

guardarFoto(id){
 
  this.foto.id_carpeta = id;
  

  
  this.db.agregarFotos( this.foto.nombre,
                        this.foto.url,
                        this.foto.fecha,
                        this.foto.id_carpeta,
                        this.foto.id_usuario);
                         
}

cargarArchivos(){
   this.file.listDir(this.file.dataDirectory, Media_folder_name_Galeria)
      .then( (data) =>{
          
        if( data.length > 0){
          this.files = data;
          
        }                      
      
      }, err => console.log('error al cargar archivos', err)
      );
      }


captureImage(){
   this.mediaCapture.captureImage({limit: 1})
      .then(
        (data) =>{
          
            this.cargarMateria(data[0].fullPath, data);
        },
        (err: CaptureError) => console.log(err)
        );
    }

copyFileToLocalDir(fullPath, data, id){

  let myPath = fullPath;  

  if(fullPath.indexOf('file://') < 0){
    myPath = 'file://' + fullPath;
  }

  const ext = myPath.split('.').pop();
  const d = Date.now();
  const newName = `${d}.${ext}`;

  const name = myPath.substr(myPath.lastIndexOf('/') + 1);
  const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);

  const copyToLocal = Local_location_name_Galeria + Media_folder_name_Galeria;
  const copyToNative = this.file.dataDirectory + Media_folder_name_Galeria;

  
  this.file.copyFile(copyFrom, name, copyToLocal, newName)
  .then( success =>{
console.log(success);

    this.cargarArchivos();    
      },
      err => {
        console.log(err);
      }
      );

  this.file.copyFile(copyFrom, name, copyToNative, newName)
  .then( success =>{

    this.cargarArchivos();
    this.full = success;
    this.foto.nombre = success.name;
    this.foto.url = success.nativeURL;
    this.guardarFoto(id);
    this.deleteFileLocal(data);       
      },
      err => {
        console.log(err);
      }
      );

}

openFile( f: FileEntry ){

  if( f.name.indexOf('.wav') > -1 ){
  // We need to remove file:/// from the path for the audio plugin to work
    const path =  f.nativeURL.replace(/^file:\/\//, '');
    const audioFile: MediaObject = this.media.create(path);
    audioFile.play();

  // }else if (f.name.indexOf('.MOV') > -1  || f.name.indexOf('.mp4') > -1){
  // // E.g: Use the Streaming Media plugin to play a video  
  //   this.streamingMedia.playVideo(f.nativeURL);

  // } else if(f.name.indexOf('jpg') > -1){
    
  //     // E.g: Use the Photoviewer to present an Image
  //     this.photoViewer.show(f.nativeURL, 'MY awesome image');
  }

}

deleteFile(f: FileEntry) {
  const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
  this.file.removeFile(path, f.name).then(() => {
    this.cargarArchivos();
  }, err => console.log('error remove: ', err));
}

deleteFileGaleria(nombre) {
  const n = Local_location_name_Galeria +  Media_folder_name_Galeria + '/';
  const path = n.substr(0, n.lastIndexOf('/') + 1);
  console.log(path,nombre);
  this.file.removeFile(path, nombre).then(() => {
    this.cargarArchivos();
    
  }, err => console.log('error remove: ', err));
}

deleteFileRoot(f, nombre) {
  const path = f.substr(0, f.lastIndexOf('/') + 1);
  this.file.removeFile(path, nombre).then(() => {
    console.log(path, nombre);
    
    this.cargarArchivos();
  }, err => console.log('error remove: ', err));
}

deleteFileLocal(f: MediaFile[]) {
  const path = f[0].fullPath.substr(0, f[0].fullPath.lastIndexOf('/') + 1);
  this.file.removeFile(path, f[0].name).then(() => {
    this.cargarArchivos();
  }, err => console.log('error remove: ', err));
}

b64(fullPath){

  let myPath = fullPath;
  

  if(fullPath.indexOf('file://') < 0){
    myPath = 'file://' + fullPath;
  }

    var imagePath = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    var imageName = myPath.substr(myPath.lastIndexOf('/') + 1);
    

   return this.file.readAsDataURL(imagePath, imageName);

  }

cargarMateria(fullPath, data){
  this.db.getMaterias().subscribe( (dat:materia[]) =>{
     this.materias = dat;

    this.cargarDB(fullPath, data);     
  }).unsubscribe();
}

cargarDB(fullPath, data){

  this.db.getEvento().subscribe( dat =>{
        this.eventos = dat;
  this.db.getCarpeta().subscribe( dat =>{
    
    
     this.carpeta = dat;

        
        this.validarFecha(fullPath, data);       
  }).unsubscribe();
  }).unsubscribe();

}

validarFecha(fullPath, data){
  
        let hora =  moment(this.fecha).format("hh:mm a");
        let dia =  moment(this.fecha).format("dddd");
        
    if(this.eventos.length > 0){
      for( let ev of this.eventos){
        for( let mate of this.materias){
            if( (ev.dia === dia ) ){
            if( mate.id_evento === ev.id){
              if( moment(ev.inicio).format("hh:mm a") <= hora && moment(ev.fin).format("hh:mm a") >= hora ){

                
                    return this.opts(mate.id, mate.nombre, fullPath, data);                             
                
              }
            }
          }
        }
      }
      this.opts(0, "Otros", fullPath, data);
    }else  return this.opts(0, "Otros", fullPath, data);
      
}

async opts(id, carpeta, fullPath, data){
  let mensaje = '';
  let input = {data:[]};

  for( let car of this.carpeta){
      input.data.push({name: car.nombre, type: 'radio', value: car.id, label: car.nombre, checked: carpeta==car.nombre});
  }
  if(carpeta !== 'Otros' ){
     mensaje =  'Estas en clases \'' + carpeta + '\'';
  }

  const alert = await this.alert.create({
    cssClass: 'my-custom-class',
    header: 'Donde quieres guardar la imagen?',
    message: mensaje,
    inputs: input.data,
    backdropDismiss: false,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
            
        }
      }, {
        text: 'Ok',
        handler: (dat) => { 
          
          if( dat < 0){
            this.db.agregarCarpeta(carpeta, 1, id).then( data =>{

            });
            this.copyFileToLocalDir(fullPath, data, 1);
          }
          
          if(this.carpeta.length == 0){
            this.db.agregarCarpetaPreder().then( _ =>{
              
              this.copyFileToLocalDir(fullPath, data, 1);
              
            });
        }else{
          this.copyFileToLocalDir(fullPath, data, dat);
        }
      }
    }
    ]
  });

  await alert.present();
}



}

