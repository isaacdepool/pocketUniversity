import { Component, OnInit, Input } from '@angular/core';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform, ActionSheetController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { AyudaPage } from 'src/app/pages/ayuda/ayuda.page';
import { GaleriaService } from 'src/app/services/galeria.service';
import { DatabaseService } from 'src/app/services/db.service';
const Media_folder_name = 'Media';
const Local_location_name = "file:///storage/emulated/0/"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string;
  files = [];
  url = [];

  constructor( private menuCtrl: MenuController,
               private galeriaSvc: GaleriaService,
               private db: DatabaseService) { }

  ngOnInit() {
    this.k();
  }

  k(){

    // this.db.getConfig2().subscribe( data => {

    //   if(data.length > 0){
        
    //     console.log(data);
        
  
    //     if( data[0].dark === 0 ){
         
    //     }else  document.body.classList.toggle( 'dark' );

    //   }else this.k();

    // });
  }

 
  toggleMenu(){
    this.menuCtrl.toggle();
  }

  camara(){

    this.galeriaSvc.getCamera().subscribe( boo =>{
      if(boo){
        this.galeriaSvc.captureImage();
      }
    });
    
  }

  
}


