import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { FabComponent } from './fab/fab.component';
import { PopoverComponent } from './popover/popover.component';
import { FechaPipe } from 'src/app/pipes/fecha.pipe';
import { DiaPipe } from '../pipes/dia.pipe';
import { HoraPipe } from '../pipes/hora.pipe';
import { PopoverOptionsComponent } from './popover-options/popover-options.component';
import { FiltroPipe } from '../pipes/filtro.pipe';
import { PopoverArchivosComponent } from './popover-archivos/popover-archivos.component';



@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    FabComponent,
    PopoverComponent,
    PopoverOptionsComponent,
    PopoverArchivosComponent,
    FechaPipe,
    DiaPipe,
    HoraPipe,
    FiltroPipe
  ],
  exports:[
    HeaderComponent,
    MenuComponent,
    FabComponent,
    PopoverController,
    PopoverOptionsComponent,
    PopoverArchivosComponent,
    FechaPipe,
    DiaPipe,
    HoraPipe,
    FiltroPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
