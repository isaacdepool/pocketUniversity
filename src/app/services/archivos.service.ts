import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/File/ngx';
import { Platform } from '@ionic/angular';

const Media_folder_name = 'Archivos';
const Local_location_name = "file:///storage/emulated/0/Myapp/";

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor( private filePath: FilePath,
               private fileChooser: FileChooser,
               private fileOpener: FileOpener,
               private file: File,
               private plt: Platform) { 

                this.plt.ready().then( () =>{
            
                  // Raiz 
                    let path = this.file.dataDirectory;
                    
                    this.file.checkDir(path,Media_folder_name)
                    .then( () =>{
              
                    }, err => {
                      this.file.createDir(path, Media_folder_name, false);
                    }
                    );
              
                  // LOCAL 
                    let path2 = Local_location_name;
                    this.file.checkDir(path2,Media_folder_name)
                    .then( () =>{
                    }, err => {
                      this.file.createDir(path2, Media_folder_name, false);
                    }
                    );
                  });
               }


  cargar(){
   return this.fileChooser.open().then( uri =>{
        
      return this.filePath.resolveNativePath(uri)
          .catch(err => console.log(err))
    }).catch(err => console.log(err))
  };

  open(url){
    this.fileOpener.showOpenWithDialog(url, '')
        .catch(err => console.log(err)
        );
  }

  copyFile(fullPath){

    let myPath = fullPath; 
    let native;
    let local; 

  if(fullPath.indexOf('file://') < 0){
    myPath = 'file://' + fullPath;
  }

  const ext = myPath.split('.').pop();
  const d = Date.now();
  const newName = `${d}.${ext}`;

  const name = myPath.substr(myPath.lastIndexOf('/') + 1);
  const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);

  const copyToLocal = Local_location_name + Media_folder_name;
  const copyToNative = this.file.dataDirectory + Media_folder_name;

  
  this.file.copyFile(copyFrom, name, copyToLocal, newName)
  .then( success =>{
    
      },
      err => {
      }
      );

  this.file.copyFile(copyFrom, name, copyToNative, newName)
  .then( success =>{
      
      },
      err => {
      }
      );

      return 

  }
}
