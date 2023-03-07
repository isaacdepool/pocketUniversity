import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService} from 'src/app/services/db.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasService } from 'src/app/services/alertas.service';
import { event } from 'src/app/interfaces/interfaces';
import { NotiService } from 'src/app/services/noti.service';

@Component({
  selector: 'app-agg-evento',
  templateUrl: './agg-evento.page.html',
  styleUrls: ['./agg-evento.page.scss'],
})
export class AggEventoPage implements OnInit {

 events: event[] = [];
 eventoCargado: event;
 
 h: Date = new Date();
 horaLocal = '01:00 am';
 diaActual = '';
 diaIngresado = moment(this.h.toISOString()).format('YYYY-MM-DD');

 id;
 boo: boolean = false;



 monthNames: any[] = []; 
 monthShortNames = moment.months();;

//  eventoModal
  evento = {
    
    dia: '',
    inicio: '',
    fin: '',
    nombre: '',
    tipo: '',
    comentario: '',
    id_usuario: 1

  }

  constructor( private db: DatabaseService,
               private navCtrl: NavController,
               private activateRouter: ActivatedRoute,
               private router: Router,
               private alert: AlertasService,
               private notiSvc: NotiService ) {
          
                this.activateRouter.queryParams.subscribe(params => {
                  if (this.router.getCurrentNavigation().extras.state) {
                    this.boo= this.router.getCurrentNavigation().extras.state.boo;
                    this.id= this.router.getCurrentNavigation().extras.state.id;
                  }
                  if(this.boo){
      
                    this.dataPreder();
                    
                  }
                });
       

              } 

  ngOnInit() {
    this.db.getDatabaseState().subscribe( boo => {
      if(boo){
         
        this.db.getEvento().subscribe ( data => {

         this.events = data;
         this.momentDateConfig();
              
        });        
      }
    });


    
  }

  // Validar evento
  
  onSubmitTemplate(){
  
    this.evento.nombre = this.evento.nombre.trim();

    if( ( this.evento.fin < this.evento.inicio )){
      
      
      this.alert.presentToast("Horas incorrectas. El inicio debe ser antes que el fin");

      this.limpiarEvento();
     
    }else if( this.evento.nombre === '' || this.evento.nombre.length < 1 ){
          this.alert.presentToast("Por favor ingrese un titulo de minimo 1 caracteres");
          
          this.limpiarEvento();
    }
    else{

        this.ingresarEvento();
        
        this.alert.presentToast("Datos guardados correctamente");
        this.navCtrl.back();
    }
  }

  momentDateConfig(){

    moment.locale('es');
    this.monthNames = moment.months();
    this.diaIngresado = moment(this.h.toISOString()).format('YYYY-MM-DD');
    
    
  }

  limpiarEvento(){

          this.evento.dia = '';
          this.evento.inicio = '';
          this.evento.fin = '';

  }

// Ingresar evento
ingresarEvento(){

  if(this.boo){

    this.notiSvc.notiEvent(  this.id, 
      this.evento.nombre,
      this.evento.comentario,
      this.evento.tipo,
      moment(this.evento.dia).format('D'),
      moment(this.evento.dia).format('M'),
      moment(this.evento.inicio).format('H'),
      moment(this.evento.inicio).format('m'),
      );
    

    this.db.updateEvento( this.id,
      this.evento.nombre, 
      this.evento.dia,
      this.evento.inicio,
      this.evento.fin,
      this.evento.tipo,
      this.evento.comentario)
      .then(_ => {
        this.evento = {
          dia: '',
          inicio: '',
          fin: '',
          nombre: '',
          tipo: '',
          comentario: '',
          id_usuario: 1
        };

      }).catch( err => console.log(err)
      );

  }else{

    this.notiSvc.notiEvent(  this.db.id_evento + 1, 
          this.evento.nombre,
          this.evento.comentario,
          this.evento.tipo,
          moment(this.evento.dia).format('D'),
          moment(this.evento.dia).format('M'),
          moment(this.evento.inicio).format('H'),
          moment(this.evento.inicio).format('m'),
          );
    
    this.db.agregarEvento(this.evento.nombre, 
      this.evento.dia,
      this.evento.inicio,
      this.evento.fin,
      this.evento.tipo,
      this.evento.comentario,
      this.evento.id_usuario)
      .then(_ => {
        this.evento = {
          dia: '',
          inicio: '',
          fin: '',
          nombre: '',
          tipo: '',
          comentario: '',
          id_usuario: 1 
        };

      }).catch( err => console.log(err)
      )

  }
}

// Datos predeterminados para editar

  dataPreder(){

    this.db.getDatabaseState().subscribe( boo => {
      if(boo){          
          this.db.cargarEventoId(this.id).then(data => {
    
            this.eventoCargado = data;
                
            this.evento = {
          
            dia: this.eventoCargado.dia,
            inicio: this.eventoCargado.inicio,
            fin: this.eventoCargado.fin,
            nombre: this.eventoCargado.nombre,
            tipo: this.eventoCargado.tipo,
            comentario: this.eventoCargado.comentario,
            id_usuario: this.id,
        
          }
        });
      }
      
    });



  }

  dia( event ){
       
    let dia = moment(event.detail.value).format("YYYY-MM-DD");
    

    if( dia === this.diaIngresado ){
      this.horaLocal = moment(this.h.toISOString()).format('hh:mm');  
    }else{
      this.horaLocal = "01:00";
    }
    
  }

  
}
