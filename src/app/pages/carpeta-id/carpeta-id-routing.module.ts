import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarpetaIdPage } from './carpeta-id.page';

const routes: Routes = [
  {
    path: '',
    component: CarpetaIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarpetaIdPageRoutingModule {}
