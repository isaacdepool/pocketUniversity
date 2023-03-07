import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggEventoPage } from './agg-evento.page';

const routes: Routes = [
  {
    path: '',
    component: AggEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggEventoPageRoutingModule {}
