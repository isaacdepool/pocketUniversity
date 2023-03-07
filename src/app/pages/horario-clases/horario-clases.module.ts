import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorarioClasesPageRoutingModule } from './horario-clases-routing.module';

import { HorarioClasesPage } from './horario-clases.page';
import { ComponentsModule } from 'src/app/components/components.module';

 
import { NgCalendarModule  } from 'ionic2-calendar';
import { CalModalPageModule } from '../cal-modal/cal-modal.module';
 
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorarioClasesPageRoutingModule,
    ComponentsModule,
    CalModalPageModule,
    NgCalendarModule

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }
  ],
  declarations: [HorarioClasesPage]
})
export class HorarioClasesPageModule {}

