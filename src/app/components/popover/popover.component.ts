import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  opts = {};
  items = [
        {
          nombre: 'editar', 
          icon: 'create'
        },
        {
          nombre: 'eliminar',
          icon: 'trash'
        },
  ]
  
  constructor( private popoverCtrl: PopoverController) { }

  ngOnInit() {
    
  }

  onClick( valor: string ){


    this.popoverCtrl.dismiss({
      item: valor
    })

  }

}
