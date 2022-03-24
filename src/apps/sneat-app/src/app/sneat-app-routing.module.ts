import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoutesToCommuneModule } from '@sneat/communes/ui';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
import { TeamRoutingModule } from '@sneat/team/pages';

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
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
		SneatAuthRoutingModule,
		RoutesToCommuneModule,
		TeamRoutingModule,
	],
	exports: [RouterModule],
})
export class SneatAppRoutingModule {
}
