import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/services/db.service';
import * as moment from 'moment';
import { fotos, carpeta, materia, event, periodo } from 'src/app/interfaces/interfaces';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.page.html',
  styleUrls: ['./info-modal.page.scss'],
})
export class InfoModalPage implements OnInit {

  @Input() tipo: string;
  @Input() id: number;

  ver = false;

  datosFotos: fotos[] = [];
  datosCarpeta: carpeta[] = [];
  datosMaterias: materia[] = [];
  datosEvento: event[] = [];
  datosPeriodo: periodo[] = [];

  constructor( private db: DatabaseService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {console.log(this.id);
  }

  ionViewWillEnter(){

    this.db.getDatabaseState().subscribe( boo =>{
      if(boo){

        if(this.tipo === 'imagenCarpeta'){
          this.cargarFotos();
          this.cargarCarpeta();
        }

        if(this.tipo === 'carpeta'){
          this.cargarCarpetaId();
          this.cargarFotos();
        }

        if(this.tipo === 'materia'){
          this.cargarMateriasId();
          
        }
      }
    });
  }

  salir(){
    this.modalCtrl.dismiss(); 
  }

  cargarFotos(){
    this.db.getFotos().subscribe( data =>{
            
      for( let datos of data){
        if(datos.id == this.id && this.tipo === 'imagenCarpeta'){
          this.datosFotos.push(datos);
          this.ver = true;

        }else if(datos.id_carpeta == this.id && this.tipo === 'carpeta'){
          this.datosFotos.push(datos);
          
        }
      }
    });
  }

  cargarCarpeta(){
    this.db.getCarpeta().subscribe( data =>{

      for( let datos of data){
        if(datos.id == this.datosFotos[0].id_carpeta){
          this.datosCarpeta.push(datos);
          
        }
      }
      this.ver = true;
    });
  }

  cargarCarpetaId(){
    this.db.cargarCarpetaId(this.id).then(data =>{
      this.datosCarpeta.push(data);
      console.log(data);
      
      this.ver = true;
    });
  }

  cargarMateriasId(){
    this.db.cargarMateriaId(this.id).then( data =>{
      this.datosMaterias.push(data);
      this.ver = true;
      
      this.cargarEvento();
      this.cargarPeriodo();
    });
  }

  cargarEvento(){

    if(this.datosMaterias[0].id_evento > 0){
    this.db.cargarEventoId(this.datosMaterias[0].id_evento).then( data =>{
        if( data){
          
              this.datosEvento.push(data);
            }
    });
  } 
  }

  cargarPeriodo(){
    this.db.cargarPeriodoId(this.datosMaterias[0].id_periodo).then( data =>{
        this.datosPeriodo.push(data);
    });
  }

}
