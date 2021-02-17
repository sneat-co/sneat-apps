import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => import('@sneat/auth-login-page').then(m => m.LoginPageModule),
	},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class SneatAuthRoutingModule {
};
