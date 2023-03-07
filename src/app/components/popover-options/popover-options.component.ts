import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-options',
  templateUrl: './popover-options.component.html',
  styleUrls: ['./popover-options.component.scss'],
})
export class PopoverOptionsComponent implements OnInit {

  items = [
    {
      nombre: 'Crear carpeta',
      icon: 'folder-open'
    },
    
  ]
  
  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  onClick( item ){
    
    this.popoverCtrl.dismiss({
    item: item

    });
  }

}
