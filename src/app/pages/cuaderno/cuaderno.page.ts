import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/db.service';

@Component({
  selector: 'app-cuaderno',
  templateUrl: './cuaderno.page.html',
  styleUrls: ['./cuaderno.page.scss'],
})
export class CuadernoPage implements OnInit {

  
                    constructor(private router: Router,
                      private navCtrl: NavController,
                      private db: DatabaseService  ) { }

  ngOnInit() {

    this.navCtrl.navigateBack(['/inicio']);

    
  }

  
   


  
}
