import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuadernoIdPage } from './cuaderno-id.page';

const routes: Routes = [
  {
    path: '',
    component: CuadernoIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuadernoIdPageRoutingModule {}
