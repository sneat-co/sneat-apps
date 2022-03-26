import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutesToCommuneModule } from '@sneat/communes/ui';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';

const routes: Routes = [
	{
		path: 'my',
		pathMatch: 'full',
		loadChildren: () =>
			import('./sneat-app-home-page/sneat-app-home-page.component.module').then(m => m.SneatAppHomePageComponentModule),
	},
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () =>
			import('./sneat-app-home-page/sneat-app-home-page.component.module').then(m => m.SneatAppHomePageComponentModule),
	},
	{
		path: 'space/:teamType/:teamId',
		loadChildren: () =>
			import('@sneat/team/pages').then(m => m.TeamSpaceRoutingModule),
	},
	{
		path: 'communes',
		loadChildren: () =>
			import('@sneat/communes/ui').then(m => m.CommunesRoutingModule),
	},
	{
		path: 'signed-out',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: '',
		redirectTo: 'communes',
		pathMatch: 'full',
	},
	{
		path: 'new-family',
		loadChildren: () => import('@sneat/communes/ui').then(m => m.NewCommunePageModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
		SneatAuthRoutingModule,
		RoutesToCommuneModule,
	],
	exports: [RouterModule],
})
export class SneatAppRoutingModule {
}
