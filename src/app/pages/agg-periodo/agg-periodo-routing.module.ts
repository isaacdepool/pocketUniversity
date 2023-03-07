import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggPeriodoPage } from './agg-periodo.page';

const routes: Routes = [
  {
    path: '',
    component: AggPeriodoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggPeriodoPageRoutingModule {}
