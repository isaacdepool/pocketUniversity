import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarpetaIdPageRoutingModule } from './carpeta-id-routing.module';

import { CarpetaIdPage } from './carpeta-id.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarpetaIdPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CarpetaIdPage]
})
export class CarpetaIdPageModule {}
