import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';

const Media_folder_name = 'MyApp';
const Local_location_name = "file:///storage/emulated/0/"

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})

export class AyudaPage implements OnInit {

  public files = [];
  url = [];
  information: any[];
  automaticClose = true;

        constructor( private file: File,
                     private http: HttpClient,
                     private media: Media,
                     private mediaCapture: MediaCapture,
                     private imagePicker: ImagePicker,
                     private streamingMedia: StreamingMedia,
                     private photoViewer: PhotoViewer,
                     private plt: Platform,
                     private actionSheetCtrl: ActionSheetController,
                     private alertCtrl: AlertController,
                    ) {

                      this.http.get('assets/data/ayuda.json').subscribe(res => {
                        this.information = res['preguntas'];
                    
                       
                      });
                    }

                    toggleSection(index){
    this.information[index].open = !this.information[index].open ;
    if(this.automaticClose && this.information[index].open)   {
    this.information
    .filter((item, itemIndex) => itemIndex != index)
    .map(item => item.open = false);
  }
  
  }

                    toggleItem(index, childIndex){
                      this.information[index].children[childIndex].open = ! this.information[index].children[childIndex].open  ;

                    }
                    

  ngOnInit() {}
                  }