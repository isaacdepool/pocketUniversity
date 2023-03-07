import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuadernoIdPageRoutingModule } from './cuaderno-id-routing.module';

import { CuadernoIdPage } from './cuaderno-id.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuadernoIdPageRoutingModule
  ],
  declarations: [CuadernoIdPage]
})
export class CuadernoIdPageModule {}
