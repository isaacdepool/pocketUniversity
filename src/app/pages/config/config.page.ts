import { Component, OnInit } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { DatabaseService } from 'src/app/services/db.service';

 
const STORAGE_KEY = 'my_images';
 
@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
 
  modoOscuro: boolean = false;
  constructor( private fileChooser: FileChooser,
               private fileOpener: FileOpener,
               private filePath: FilePath,
               private db: DatabaseService) { 

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.modoOscuro = prefersDark.matches;
    console.log(prefersDark);
    

    this.db.getConfig2().subscribe( data => {
  
        if(data.length > 0){
          
          console.log(data);
          
    
          if( data[0].dark === 0 ){
  
            this.modoOscuro = false;
           
          }else  this.modoOscuro = true;
  
        }  
      });
      
  }

  ngOnInit() {

  }

  darkMode(){
      
        this.modoOscuro = !this.modoOscuro;

        if( this.modoOscuro ){

          this.db.updateCofigDark( 1, 1);

          document.body.classList.toggle( 'dark' );
        }else{
          document.body.classList.toggle( 'dark' );
          this.db.updateCofigDark( 1, 0);}

     
    }

  
}

