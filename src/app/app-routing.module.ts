import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: 'materias',
    loadChildren: () => import('./pages/materias/materias.module').then( m => m.MateriasPageModule)
  },
  {
    path: 'horario-clases',
    loadChildren: () => import('./pages/horario-clases/horario-clases.module').then( m => m.HorarioClasesPageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./pages/ayuda/ayuda.module').then( m => m.AyudaPageModule)
  },
  {
    path: 'cuaderno',
    loadChildren: () => import('./pages/cuaderno/cuaderno.module').then( m => m.CuadernoPageModule)
  },
  {
    path: 'galeria',
    loadChildren: () => import('./pages/galeria/galeria.module').then( m => m.GaleriaPageModule)
  },
  {
    path: 'agg-evento',
    loadChildren: () => import('./pages/agg-evento/agg-evento.module').then( m => m.AggEventoPageModule)
  },
  {
    path: 'agg-periodo',
    loadChildren: () => import('./pages/agg-periodo/agg-periodo.module').then( m => m.AggPeriodoPageModule)
  },
  {
    path: 'agg-materia',
    loadChildren: () => import('./pages/agg-materia/agg-materia.module').then( m => m.AggMateriaPageModule)
  },
  {
    path: 'cuaderno-id/:idC/:idM',
    loadChildren: () => import('./pages/cuaderno-id/cuaderno-id.module').then( m => m.CuadernoIdPageModule)
  },
  {
    path: 'materia-id/:id',
    loadChildren: () => import('./pages/materia-id/materia-id.module').then( m => m.MateriaIdPageModule)
  },
  {
    path: 'carpeta-id',
    loadChildren: () => import('./pages/carpeta-id/carpeta-id.module').then( m => m.CarpetaIdPageModule)
  },
  {
    path: 'cal-modal',
    loadChildren: () => import('./pages/cal-modal/cal-modal.module').then( m => m.CalModalPageModule)
  },
  {
    path: 'info-modal',
    loadChildren: () => import('./pages/info-modal/info-modal.module').then( m => m.InfoModalPageModule)
  },
  {
    path: 'imagen-modal',
    loadChildren: () => import('./pages/imagen-modal/imagen-modal.module').then( m => m.ImagenModalPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./pages/tab1/tab1.module').then( m => m.Tab1PageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./pages/tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./pages/tab3/tab3.module').then( m => m.Tab3PageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
