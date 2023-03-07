import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-popover-archivos',
  templateUrl: './popover-archivos.component.html',
  styleUrls: ['./popover-archivos.component.scss'],
})
export class PopoverArchivosComponent implements OnInit {

  @Input() opt = [{ nombre: 'Cargar Archivos'}];
  item2 = '';
  url2 = '';
  
  constructor( private popoverCtrl: PopoverController,
               ) { 

               
               }

  ngOnInit() {

  }

  onClick( item, url? ){

   

    if( item.length > 0){
    this.item2 = item,
    this.url2 = url
    }
    
    this.popoverCtrl.dismiss({
      
    item: item,
    url: url

    });
  }
}
