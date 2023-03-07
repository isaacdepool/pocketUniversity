import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuadernoPageRoutingModule } from './cuaderno-routing.module';

import { CuadernoPage } from './cuaderno.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuadernoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CuadernoPage]
})
export class CuadernoPageModule {}
