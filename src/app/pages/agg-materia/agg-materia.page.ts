import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/db.service';
import { PickerController, NavController } from '@ionic/angular';
import { PickerOptions } from "@ionic/core"
import { AlertasService } from 'src/app/services/alertas.service';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { materia, event } from 'src/app/interfaces/interfaces';
import * as moment from 'moment';
import { NotiService } from 'src/app/services/noti.service';

@Component({
  selector: 'app-agg-materia',
  templateUrl: './agg-materia.page.html',
  styleUrls: ['./agg-materia.page.scss'],
})
export class AggMateriaPage implements OnInit {
   
  dbMaterias: materia[] = [];
  dbPeriodo: {} = {};

  materiaId: number;
  boo: boolean = false;

  verEven: boolean = false;
  validarEvent: boolean = false;

  titulo = 'Agregar materia'

  semanas = ['lunes','martes','miércoles','jueves', 'viernes','sábado', 'domingo'];

  modalMaterias = {

// materia   
    nombre: '',
    id_evento: 0,
    id_periodo: 0,
    id_materia: 0,

// periodo 
    periodo: '',

// evento
    dia: 'lunes',
    inicio: '',
    fin: '',
    comentario: '',
    tipo: 'library'
  }



  constructor( private db: DatabaseService,
              private pk: PickerController,
              private alerta: AlertasService,
              private navCtrl: NavController,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private notiSvc: NotiService ) { 


                this.activatedRoute.queryParams.subscribe(params => {
                  if (this.router.getCurrentNavigation().extras.state) {
                    this.boo = this.router.getCurrentNavigation().extras.state.boo;
                    this.materiaId = this.router.getCurrentNavigation().extras.state.id;
                    
                  }
                  if(this.boo){
      
                    this.dataPreder();
                    this.titulo = 'Editar materia'
                    
                  }

                  if(!this.boo){
                    this.activatedRoute.queryParams.subscribe(params => {
            
                      if (this.router.getCurrentNavigation().extras.state) {
                        this.modalMaterias.id_periodo= this.router.getCurrentNavigation().extras.state.id;
                        this.modalMaterias.periodo= this.router.getCurrentNavigation().extras.state.nombre;
            
                      }
                    });
                  }
                });

                
            }

  ngOnInit() {

    this.db.getDatabaseState().subscribe( boo => {

      
      if(boo){
        this.db.getPeriodo().subscribe( data => {
          this.dbPeriodo = data;
          
          this.db.getMaterias().subscribe( data =>{
            this.dbMaterias = data;
        });

        })
        

      }
    });

    
  }

  async pick(){

    let options: PickerOptions  = {
        
      cssClass: 'pick',  

      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          handler: () =>{ 
            
          }
        },
        {
          text: "Aceptar",
          role: '',
          handler: (data) => {
            this.modalMaterias.dia = data.semanas.value;
                         
          }
        }
      ],
      columns: [{

        name: "semanas",
        options: this.getOpt(),

      }]
    };
    
    const picker = await this.pk.create(options);
    picker.present();
}

getOpt(){
  let opt = [];
  this.semanas.forEach( x => {
    opt.push({text: x.toLocaleUpperCase(), value: x})
  });
  return opt;
}

ver(){

    this.verEven = !this.verEven
    

}

guardarDatos(){

  if(this.boo){
    this.editarDatos();
  }else{
  
  this.modalMaterias.nombre = this.modalMaterias.nombre.trim();
  this.validarHorario();
  
  
  if((this.verEven && this.modalMaterias.nombre.length > 0) && (this.modalMaterias.inicio < this.modalMaterias.fin ) && this.validarEvent){

    // Crear evento 
    
    this.db.agregarEvento( this.modalMaterias.nombre,
                           this.modalMaterias.dia,
                           this.modalMaterias.inicio,
                           this.modalMaterias.fin,
                           this.modalMaterias.tipo,
                           this.modalMaterias.comentario,
                           1)
              .then( data =>{ 
       
                            this.modalMaterias.id_evento = this.db.id_evento + 1;
 
    // Crear materia 
              this.db.agregarMaterias( this.modalMaterias.nombre,
                                       1,
                                       this.modalMaterias.id_periodo,
                                       this.modalMaterias.id_evento).then( data =>{

                                         this.modalMaterias.id_materia = data;
                                         
                                       }).then( _ => {                 

   // Crear carpeta 

  //  this.db.agregarCarpeta( this.modalMaterias.nombre,
  //   1,
  //   this.modalMaterias.id_materia);
  //                       }).then( _ =>{

                          moment.locale('es');

   this.notiSvc.notiClases( this.modalMaterias.id_evento,
                            this.modalMaterias.nombre,
                            this.modalMaterias.comentario,
                            this.modalMaterias.dia,
                            moment(this.modalMaterias.inicio).format('H'),
                            moment(this.modalMaterias.inicio).format('m'));

                            this.alerta.presentToast("Datos guardados con exito");
                            this.navCtrl.back();

                          }).catch( err => this.alerta.presentToast(err) );                              
                            
   });

  }else if((this.modalMaterias.nombre.length > 0) && !this.verEven){
                this.db.agregarMaterias( this.modalMaterias.nombre,
                                         1,
                                         this.modalMaterias.id_periodo,
                                         this.modalMaterias.id_evento)
                            .then( data =>{
    this.modalMaterias.id_materia = data;
    
   // Crear carpeta 

  //  this.db.agregarCarpeta( this.modalMaterias.nombre,
  //   1,
  //   this.modalMaterias.id_materia);

                              
  //                           }).then( _ =>{
                              this.alerta.presentToast("Datos guardados con exito");
                              this.navCtrl.back();
                            });
    
  }else if(!this.validarEvent && this.verEven){
    this.alerta.presentToast('Ya existe una materia registrada con este horario');
    this.borrarFecha();
  
  }else if( (this.modalMaterias.inicio >= this.modalMaterias.fin) && this.verEven ){
    this.alerta.presentToast('Horas incorrectas. El inicio debe ser antes que el fin');
    this.borrarFecha();

  }else this.alerta.presentToast('Ingrese un titulo para la materia');

  }
}

borrarFecha(){
  this.modalMaterias.inicio = '';
  this.modalMaterias.fin = '';
}

validarHorario(){

  let evento: event[] = [];
  let id_evetoMateria;

  this.db.getEvento().subscribe( data =>{
    evento = data;
  });

  for(let [i,dat] of this.dbMaterias.entries()){
    if( dat.id === this.materiaId){
      id_evetoMateria = dat.id_evento;
      
    }
  }

if( evento.length > 0){
  
  for( let event of evento ){
      
      if( event.dia === this.modalMaterias.dia && this.modalMaterias.id_evento != event.id && event.id && id_evetoMateria != 1){
        
        let inicio = moment(event.inicio).format("HH:mm");
        let fin =  moment(event.fin).format("HH:mm");

        let inicioM = moment(this.modalMaterias.inicio).format("HH:mm");
        let finM =  moment(this.modalMaterias.fin).format("HH:mm");

      if( (inicio == inicioM && fin == finM) || (inicio <= inicioM && fin >= finM ) || (inicio <= inicioM && fin <= finM && fin >= inicioM ) || (inicio >= inicioM && fin >= finM && inicio <= finM ) || (inicio >= inicioM && fin <= finM && inicio <= finM ) ){
            
        return this.validarEvent = false;
      }else this.validarEvent = true;

    }if(id_evetoMateria === 1){

      if( event.dia === this.modalMaterias.dia){
        
        let inicio = moment(event.inicio).format("HH:mm");
        let fin =  moment(event.fin).format("HH:mm");

        let inicioM = moment(this.modalMaterias.inicio).format("HH:mm");
        let finM =  moment(this.modalMaterias.fin).format("HH:mm");

      if( (inicio == inicioM && fin == finM) || (inicio <= inicioM && fin >= finM ) || (inicio <= inicioM && fin <= finM && fin >= inicioM ) || (inicio >= inicioM && fin >= finM && inicio <= finM ) || (inicio >= inicioM && fin <= finM && inicio <= finM ) ){
            
        return this.validarEvent = false;
      }else this.validarEvent = true;
    }else this.validarEvent = true;

      

    } else this.validarEvent = true;
  }
}else return this.validarEvent = true

}

dataPreder(){
  this.db.cargarMateriaId(this.materiaId).then( data =>{
    this.modalMaterias.nombre = data.nombre;
    this.modalMaterias.id_periodo = data.id_periodo;
    this.modalMaterias.id_evento = data.id_evento;
    
  if( data.id_evento > 0){
    this.db.cargarEventoId(data.id_evento).then( data2 =>{
      this.modalMaterias.dia = data2.dia;
      this.modalMaterias.inicio = data2.inicio;
      this.modalMaterias.fin = data2.fin;
      this.verEven = true;
    });
  }
  });
}

editarDatos(){
  console.log(this.modalMaterias);
  

  this.modalMaterias.nombre = this.modalMaterias.nombre.trim();
  this.validarHorario();
  
  
  
  if((this.verEven && this.modalMaterias.nombre.length > 0) && (this.modalMaterias.inicio < this.modalMaterias.fin ) && this.validarEvent){

    // Crear evento  
    if(this.modalMaterias.id_evento === 0){

      this.db.agregarEvento( this.modalMaterias.nombre,
        this.modalMaterias.dia,
        this.modalMaterias.inicio,
        this.modalMaterias.fin,
        this.modalMaterias.tipo,
        this.modalMaterias.comentario,
        1).then(_=>{
          this.modalMaterias.id_evento = this.db.id_evento + 1;

            this.db.updateMaterias(  this.materiaId,
            this.modalMaterias.nombre,
            this.modalMaterias.id_periodo,
            this.modalMaterias.id_evento);
            
        });
    }else{

      this.db.updateEvento(  this.modalMaterias.id_evento,
                             this.modalMaterias.nombre,
                             this.modalMaterias.dia,
                             this.modalMaterias.inicio,
                             this.modalMaterias.fin,
                             this.modalMaterias.tipo,
                             this.modalMaterias.comentario);
   
      // Crear materia 
      
                this.db.updateMaterias(  this.materiaId,
                                         this.modalMaterias.nombre,
                                         this.modalMaterias.id_periodo,
                                         this.modalMaterias.id_evento);

    }
    

    // Crear carpeta 

  //  this.db.updateCarpeta( this.materiaId,
  //                         this.modalMaterias.nombre);

   this.notiSvc.notiClases( this.modalMaterias.id_evento,
                            this.modalMaterias.nombre,
                            this.modalMaterias.comentario,
                            this.modalMaterias.dia,
                            moment(this.modalMaterias.inicio).format('H'),
                            moment(this.modalMaterias.inicio).format('m'));

                          this.alerta.presentToast("Datos actualizados con exito");
                          this.navCtrl.back();

}else if((this.modalMaterias.nombre.length > 0) && !this.verEven){

  this.db.updateMaterias( this.materiaId,
                          this.modalMaterias.nombre,
                          this.modalMaterias.id_periodo,
                          0);
    
   // Eliminar evento

   this.db.eliminarEvento(this.modalMaterias.id_evento);
   this.alerta.presentToast("Datos actualizados con exito");
   this.navCtrl.back();
    
  }else if(!this.validarEvent && this.verEven){
    this.alerta.presentToast('Ya existe una materia registrada con este horario');
    this.borrarFecha();
  
  }else if( (this.modalMaterias.inicio >= this.modalMaterias.fin) && this.verEven ){
    this.alerta.presentToast('Horas incorrectas. El inicio debe ser antes que el fin');
    this.borrarFecha();

  }else this.alerta.presentToast('Ingrese un titulo para la materia');

  }

}
