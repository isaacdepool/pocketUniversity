import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggEventoPageRoutingModule } from './agg-evento-routing.module';

import { AggEventoPage } from './agg-evento.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggEventoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AggEventoPage]
})
export class AggEventoPageModule {}
