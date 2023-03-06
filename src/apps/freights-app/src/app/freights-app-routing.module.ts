import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
// TODO: fix & remove this eslint hint @nrwl/nx/enforce-module-boundaries
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LogistMenuComponent } from '@sneat/extensions/express';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('../pages/freights-app-home-page.module').then(m => m.FreightsAppHomePageModule),
	},
	{
		path: 'signed-out',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: '',
		outlet: 'menu',
		pathMatch: 'full',
		// loadChildren: () => import('@sneat/extensions/express').then(m => m.ExpressTeamMenuModule),
		component: LogistMenuComponent,
	},
	{
		path: 'space/:teamType/:teamID',
		loadChildren: () => import('@sneat/extensions/express').then(m => m.LogistTeamRoutingModule),
	},

];

@NgModule({
	imports: [
		RouterModule.forRoot(routes/*, { preloadingStrategy: PreloadAllModules }*/),
		SneatAuthRoutingModule,
		// RoutesToCommuneModule,
	],
	exports: [
		RouterModule,
	],
})
export class FreightsAppRoutingModule {
}
