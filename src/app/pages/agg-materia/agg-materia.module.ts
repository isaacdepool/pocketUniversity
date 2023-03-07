import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggMateriaPageRoutingModule } from './agg-materia-routing.module';

import { AggMateriaPage } from './agg-materia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggMateriaPageRoutingModule
  ],
  declarations: [AggMateriaPage]
})
export class AggMateriaPageModule {}
