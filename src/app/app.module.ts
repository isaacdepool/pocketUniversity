import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';

import { HttpClientModule } from '@angular/common/http';

//DB 
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { IonicStorageModule } from '@ionic/storage';


//Media 
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/File/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NgCalendarModule  } from 'ionic2-calendar';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@NgModule({
  declarations: [AppComponent,],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    IonicStorageModule
  ],
  exports: [],
  providers: [
    Camera,
    WebView,
    LocalNotifications,
    SocialSharing,
    NgCalendarModule,
    FileChooser,
    FileOpener,
    FilePath,
    ImagePicker,
    File,
    MediaCapture,
    Media,
    StreamingMedia,
    PhotoViewer,
    SQLite,
    { provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy },
    StatusBar,
    SQLitePorter,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
