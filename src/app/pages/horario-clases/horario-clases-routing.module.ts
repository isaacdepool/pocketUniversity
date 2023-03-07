import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorarioClasesPage } from './horario-clases.page';

const routes: Routes = [
  {
    path: '',
    component: HorarioClasesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorarioClasesPageRoutingModule {}
