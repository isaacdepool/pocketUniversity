import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MateriaIdPageRoutingModule } from './materia-id-routing.module';

import { MateriaIdPage } from './materia-id.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MateriaIdPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [MateriaIdPage]
})
export class MateriaIdPageModule {}
