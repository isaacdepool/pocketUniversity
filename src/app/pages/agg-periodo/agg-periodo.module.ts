import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggPeriodoPageRoutingModule } from './agg-periodo-routing.module';

import { AggPeriodoPage } from './agg-periodo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggPeriodoPageRoutingModule
  ],
  declarations: [AggPeriodoPage]
})
export class AggPeriodoPageModule {}
