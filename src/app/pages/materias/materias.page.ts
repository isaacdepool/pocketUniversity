import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { NavigationExtras, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { periodo, event } from 'src/app/interfaces/interfaces';
import { DatabaseService } from 'src/app/services/db.service';
import { NotiService } from 'src/app/services/noti.service';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage implements OnInit {

  opt;
  verTri: number;

  dataPeriodo:{};
  dataMateria: event[]=[];
  prederPeriodo: periodo;
  periodo = {
    nombre: '',
    id_usuario: 1,
  }

  valid: boolean = false;

  constructor( private popoverCtrl: PopoverController,
               private alertCtrl: AlertController,
               private navCtrl: NavController,
               private db: DatabaseService,
               private alertSvc: AlertasService,
               private router: Router,
               private notiSvc: NotiService) { }

  ngOnInit() {

    this.db.getDatabaseState().subscribe( boo => {
      if(boo){
        this.db.getPeriodo().subscribe( data => {
          this.dataPeriodo = data;
        });
        
        this.db.getMaterias().subscribe( data =>{ 
           this.dataMateria = data;
           
        });

        
      }
    })

    
  }

  onClick( idx ){
  
    if( this.verTri === idx ){
      this.verTri = null;

    }else{
      this.verTri = idx;
    }

  }


  async opts( event, id ){

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



     this.optPeriodo(id);
    
    }

  }

  optPeriodo(id){

    if( this.opt === 'eliminar'){
      this.eliminarPeriodo(id);

    }else if( this.opt === 'editar'){
      this.cargarPeriodo(id);
    }
  }

  async eliminarPeriodo( id: number ){
      
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: '¿Quieres eliminar este periodo?',
      message: 'Se eliminaran materias, notas y eventos...',
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
            text: 'Eliminar periodo',
            handler: (blah) => {
               this.db.eliminarPeriodo(id);
               this.db.cargarMateriaPeriodo(id).then( data =>{
                 console.log(data, 'h');
                 
                 
                for( let mate of data ){
                  if(mate.id_evento > 0){
                  this.db.eliminarEvento(mate.id_evento);  

                  this.notiSvc.clearNoti(mate.id_evento);
                }
                this.db.eliminarCuadernoPeriodo(mate.id);
                }  
                 this.db.eliminarMateriasPeriodo(id);
                  
               });
               this.alertSvc.presentToast("Periodo eliminado con exito");
            }
          }
      ]
    });

    await alert.present();
    
  }

  async nuevoPeriodo() {

    let text:string = 'titulo'
    let value:string = ''
    let header: string = 'Agregar Periodo'
    if (this.valid){
      text = this.prederPeriodo.nombre;
      value = this.prederPeriodo.nombre;
      header = 'Editar periodo';
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-css',
      header: header,
      backdropDismiss: false,
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: text,
          value: value
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.valid = false;
          }
        }, {
          text: 'Guardar',
          handler: ( data ) => {

           data.nombre = data.nombre.trim();
           
            if ( data.nombre.length > 0 ){
                  this.periodo = {
                    nombre: data.nombre,
                    id_usuario: 1
                  }

                if(this.valid){

                  this.db.updatePeriodo(this.prederPeriodo.id, this.periodo.nombre)
                          .then( _ =>{
                          this.valid = false;

                          });
                  
                }else{
                  this.valid = false;
                 this.guardarPeriodo();}

                }else{
                  this.alertSvc.presentToast('Debe de ingresar un titulo');
                }
            
          }
        }
      ]
    });

    await alert.present();
  }

  guardarPeriodo(){

    this.db.getDatabaseState().subscribe( boo => {
      if(boo){        
          this.db.agregarPeriodo(this.periodo.nombre, this.periodo.id_usuario);
          this.periodo = {
            nombre:'',
            id_usuario: 0
          }
      }
    });
        
  }

  cargarPeriodo(id){
    this.db.getDatabaseState().subscribe( boo => {
      if(boo){        
          this.db.cargarPeriodoId(id).then( data => {
            this.prederPeriodo = data;
            this.valid = true;
            this.nuevoPeriodo();
          });
      }
    });
  }

  aggMateria( id, nombre ){
   
    let navigationExtras: NavigationExtras = { state: { id: id, nombre: nombre } };
        this.navCtrl.navigateForward(['/agg-materia'], navigationExtras);
    
  }

  irCuaderno( id ){
    
    this.router.navigate( ['/materia-id', id] );
    
  }


  
}
