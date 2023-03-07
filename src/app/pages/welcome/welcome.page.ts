import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/db.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

final = true;

  slideOpts = {

    initialSlide: 0,
    speed: 400

  }

  constructor(private router: Router,
              private navCtrl: NavController,
              private db: DatabaseService ) { }

  ngOnInit() {

    this.db.getConfig().subscribe( d =>{
      if( d[0].inicio === 1){
      let navigationExtras: NavigationExtras = { state: { boo: 1} };
      this.navCtrl.navigateBack(['/inicio'], navigationExtras);
      }
    })
  }

  navigateToLogin(){

    this.db.updateCofigInicio( 1, 1).then( _ =>{

      let navigationExtras: NavigationExtras = { state: { boo: 1} };
      this.navCtrl.navigateBack(['/inicio'], navigationExtras);
    })
    
  }

slide(){

  this.final = false;

}

}
