import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { component, event } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { DatabaseService, } from 'src/app/services/db.service';
import * as moment from 'moment';
import 'moment/locale/es'
import { AlertasService } from 'src/app/services/alertas.service';
import { ActivatedRoute, Router } from '@angular/router';

export interface dev{
  items: [];
}
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  components: Observable<component[]>;
  dataYoutube: dev[] = [];
  dataConfig: any[] = [];
  dataEvent = [];
  dataEventIn: any[] = [];
  e;
  boolean = false;

  
  diaa = [];
  inicio = [];
  diaC = [];

  diaLocal: Date = new Date();

  boo: number = 0;


  constructor( private menuCtrl: MenuController,
               private dataSvc: DataService,
               private db: DatabaseService,
               private alertSvc: AlertasService,
               private activateRouter: ActivatedRoute,
               private router: Router,
               private navCtrl: NavController) {

                this.activateRouter.queryParams.subscribe(params => {
                  if (this.router.getCurrentNavigation().extras.state) {
                    this.boo = this.router.getCurrentNavigation().extras.state.boo;
                    
                  }
                  
                 }); //config
                  
    this.cargarYoutube();


                } 
  ionViewWillEnter(){  
  //   this.db.getConfig().subscribe( data =>{

  //     this.dataConfig = data; 
  //     this.config();

             
  //   });

  //   this.db.getEvento().subscribe( dat => {
  //     this.dataEvent = dat;
      
      

  //     this.metodo();
  //  }).unsubscribe();
  


  }

  ngOnInit() {

    this.db.getDatabaseState().subscribe( boo =>{
      if(boo){

        this.db.getConfig().subscribe( data =>{
  
          this.dataConfig = data; 
          this.config();
  
                 
        });
  
        this.db.getEvento2().subscribe( dat => {
          
          if(dat.length > 0){
            
            for( let [i, d] of dat.entries() ){
              
              this.dataEvent.push(d);
            
            }
            this.metodo();
            
  
          }
      });

      }
       });
      

    
  }

  doRefresh(event) {

    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 1500);
  }

  onClick(){
    this.navCtrl.navigateForward(['/welcome']);
  }

  config(){

    
    if(this.dataConfig.length > 0){

      
      if(this.dataConfig[0].inicio === 0){
        
        this.navCtrl.navigateForward(['/welcome']);

      }
     }

  }

  metodo(){
  
    if(this.dataEvent.length > 0){
          
    for( let [i, dat] of this.dataEvent.entries() ){

      this.diaa.push( moment(dat.dia).format("DD MMMM YYYY") );
      this.inicio.push( moment(dat.inicio).format("HH:mm") );
      
      
      this.diaC.push(this.diaa[i] + ' ' + this.inicio[i]);                          

       this.dataEventIn.push( this.diaC );
     }

     this.bubble(this.diaC);
    }
  }

  dia(index){

    

    if(this.dataEvent.length > 0){


      if(this.diaC[index] > moment(this.diaLocal).format("DD MMMM YYYY HH:mm")){
        
        this.e = this.dataEvent[index];
        
        this.boolean = true;
        return;
  
      }else if(index < this.dataEvent.length-1) {
  
        this.dia(index + 1 );
  
      }else this.boolean = false;

    }
  }

bubble(a){

    var swapp;
    var n = a.length-1;
    var x=a;
    let d = this.dataEvent;
    do {
        swapp = false;
        for (var i=0; i < n; i++)
        {
            if (x[i] > x[i+1])
            {
               var temp = d[i];
               d[i] = d[i+1];
               d[i+1] = temp;

               var temp2 = x[i];
               x[i] = x[i+1];
               x[i+1] = temp2;
               swapp = true;
            }
        }
        n--;
    } while (swapp);

    this.diaC = x;
    
    this.dia(0);
    
 return x; 
}

  toggleMenu(){
    this.menuCtrl.toggle();
  }

  cargarYoutube(){

    this.dataSvc.getYoutube()
      .subscribe( (resp:dev) =>{
        console.log( resp.items );

        this.dataYoutube.push(...resp.items);
      })
  }



  

}
