import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: DatabaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
      this.checkDarkmode();
    });
  }

  checkDarkmode(){
    
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // this.db.getConfig2().subscribe( data => {

    //   if(data.length > 0){
        
    //     console.log(data);
        
  
    //     if( data[0].dark === 0 ){
         
    //     }else  document.body.classList.toggle( 'dark' );
    //   }

    // });
    
  }
}
