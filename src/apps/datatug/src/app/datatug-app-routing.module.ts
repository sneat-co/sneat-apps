import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {SNEAT_AUTH_GUARDS} from '@sneat/auth';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('@sneat/datatug/pages/home').then((m) => m.DatatugPagesHomeModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'my',
    ...SNEAT_AUTH_GUARDS,
    loadChildren: () => import('@sneat/datatug/pages/my').then(m => m.DatatugMyPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class DatatugAppRoutingModule {}
