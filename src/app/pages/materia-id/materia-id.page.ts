import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PopoverController, AlertController, NavController, ModalController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { DatabaseService } from 'src/app/services/db.service';
import * as moment from 'moment';
import { AlertasService } from 'src/app/services/alertas.service';
import { cuaderno, materia, periodo, event } from 'src/app/interfaces/interfaces';
import { InfoModalPage } from '../info-modal/info-modal.page';
import { NotiService } from 'src/app/services/noti.service';

@Component({
  selector: 'app-materia-id',
  templateUrl: './materia-id.page.html',
  styleUrls: ['./materia-id.page.scss'],
})
export class MateriaIdPage implements OnInit {

  dataCuaderno: cuaderno[] = [];
  dataPeriodo: periodo[] = [];
  dataEvento: event[] = [];
  dataMateria: materia[] = [];
  materiaId: number;
  opt;
  
  dia: string = '';
  hora: string = '';
  fechaHoy: Date = new Date();

  @Output() idMateria: EventEmitter<number>;

  constructor( private activatedRoute: ActivatedRoute,
               private popoverCtrl: PopoverController,
               private db: DatabaseService,
               private router: Router,
               private alertCtrl: AlertController,
               private alertSvc: AlertasService,
               private navCtrl: NavController,
               private modalCtrl: ModalController,
               private notiSvc: NotiService) { 
        
            this.idMateria = new EventEmitter();

            this.activatedRoute.params.subscribe( params => {
              this.materiaId = params['id'];
              this.pgMoment();
        
        
            });
                
               }

 async ngOnInit() {

    this.db.getDatabaseState().subscribe( boo =>{
      if(boo){
         this.db.getCuaderno().subscribe( (data) => {
            this.dataCuaderno = data.slice().reverse();
            
         });
         
         this.db.getPeriodo().subscribe( data =>{
           this.dataPeriodo = data;
          });

          this.db.cargarMateriaId(this.materiaId).then( data =>{
            this.dataMateria.push(data);
            
     
         });
          
          this.db.getEvento().subscribe( data =>{
            this.dataEvento = data;
          });
          
        }
      });
      
      
      
    }

    edit(){
      let navigationExtras: NavigationExtras = { state: { id: this.materiaId, boo: true } };
      this.navCtrl.navigateForward(['/agg-materia'], navigationExtras);
    }
    

  async more( event, id ){

    const popover = await this.popoverCtrl.create({
     component: PopoverComponent,
     cssClass: 'css_popover',
     event: event,
     mode: 'ios'
    });
 
    await popover.present();

    const { data } =
    
    await popover.onDidDismiss();

    if(data){

    this.opt = data.item;



     this.optCuaderno(id);
    }

  }

  optCuaderno(id){
  
    if(this.opt === 'editar'){ 
    
      this.abrirNota(id);

  }else if(this.opt === 'eliminar'){
    this.eliminar(id);
  }

  }

  async borrar(){

    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar esta materia?',
      message: 'Se eliminaran los horarios y todas las notas creadas',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        },
          {
            text: 'Eliminar materia',
            handler: (blah) => {
              this.db.eliminarMaterias(this.dataMateria[0].id);
              this.db.eliminarCuadernoPeriodo(this.dataMateria[0].id);
              this.db.eliminarEvento(this.dataMateria[0].id_evento);
              console.log(this.dataMateria[0].id);
              this.navCtrl.back();
            }
          }
      ]
    });

    await alert.present(); 
  }

  abrirNota(id){
    this.router.navigate( ['/cuaderno-id', id, this.materiaId] );
  }


  pgMoment(){
      
    moment.locale('es');

    this.dia = moment().format("MMMM DD YYYY");
    this.hora = moment(this.dataCuaderno['fehca_mod']).format("HH:mm");

    
    
  }

  async eliminar(id:number){
      
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar esta nota?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        },
          {
            text: 'Eliminar nota',
            handler: (blah) => {
               this.db.eliminarCuaderno(id);
               this.alertSvc.presentToast("Nota eliminada con exito");
            }
          }
      ]
    });

    await alert.present(); 

  }

  async info(){
    const modal = await this.modalCtrl.create({
      component: InfoModalPage,
      componentProps: {
        tipo: 'materia',
        id: this.materiaId
      }
    });
    await modal.present();
  }

  async eliminarMateria(){
      
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar esta materia?',
      message: 'Se eliminaran las notas y horarios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        },
          {
            text: 'Eliminar materia',
            handler: (blah) => {
              this.db.eliminarMaterias(this.materiaId).then( _ =>{

                 this.db.eliminarCuadernoPeriodo(this.idMateria);
                 this.db.eliminarEvento(this.dataMateria[0].id_evento);

                  this.notiSvc.clearNoti(this.dataMateria[0].id_evento);
                  
              });
               this.alertSvc.presentToast("Materia eliminada con exito");
               this.navCtrl.back();
            }
          }
      ]
    });

    await alert.present(); 

  }


}

