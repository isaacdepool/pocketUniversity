import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
})
export class FabComponent implements OnInit {

  @Input() pageInicio;
  @Input() pageEvent;
  @Input() pageMaterias;
  @Input() pageCuaderno;
  @Input() pageHorario;
  @Input() pageGaleria;
  @Input() pageMateriaId;
  @Input() pageCuadernoId;


  opts= '';

  @Input() idMateria = '0';
  
  constructor( private nav: NavController) {
    
   }

  ngOnInit() {

  if(this.pageEvent){
    this.opts = '/agg-evento';
  }

  if(this.pageInicio){
    this.opts = 'Insertar opciones inicio';
  }

  if(this.pageHorario){
    this.opts = '/agg-materia';
  }

  if(this.pageCuaderno){
    this.opts = '/agg-materia';
  }

  if(this.pageMaterias){
    this.opts = 'Insertar opciones materias';
  }

  if(this.pageGaleria){
    this.opts = 'Insertar opciones Galeria';
  }

  if(this.pageCuadernoId){
    this.opts = 'Insertar opciones cuaderno';
  }

  if(this.pageMateriaId){
    this.opts = '/cuaderno-id/0/' + this.idMateria;
  }

  return;

}

onClick(){
  this.nav.navigateForward(this.opts);
}

}
