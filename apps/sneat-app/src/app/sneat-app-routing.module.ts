import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		outlet: 'menu',
		component: SneatAppMenuComponent,
	},
	// {
	// 	path: 'my',
	// 	pathMatch: 'full',
	// 	loadChildren: () =>
	// 		import('./sneat-app-home-page/sneat-app-home-page.component.module').then(m => m.SneatAppHomePageComponentModule),
	// },
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () =>
			import('./pages/sneat-app-home-page/sneat-app-home-page.component').then(
				(m) => m.SneatAppHomePageComponent,
			),
	},
	{
		path: 'telegram/mini-app',
		pathMatch: 'full',
		loadComponent: () =>
			import(
				'./pages/telegram-mini-app-home/telegram-mini-app-home-page.component'
			).then((m) => m.TelegramMiniAppHomePageComponent),
	},
	{
		path: 'my',
		loadChildren: () =>
			import('./sneat-app-my-routing.module').then(
				(m) => m.SneatAppMyRoutingModule,
			),
	},
	{
		path: 'space/:spaceType/:spaceID',
		loadChildren: () =>
			import('@sneat/team-pages').then((m) => m.SpaceRoutingModule),
	},
	{
		path: 'join/:spaceType',
		loadComponent: () =>
			import('@sneat/team-pages').then((m) => m.JoinSpacePageComponent),
	},
	// {
	// 	path: 'invite-to/:spaceType',
	// 	loadChildren: () => import('@sneat/space-pages').then(m => m.)
	// },
	{
		path: 'communes', // TODO: Obsolete route naming and probably the whole route
		loadChildren: () =>
			import('@sneat/communes-ui').then((m) => m.CommunesRoutingModule),
	},
	{
		path: 'signed-out',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'new-family',
		loadChildren: () =>
			import('@sneat/communes-ui').then((m) => m.NewCommunePageModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
		SneatAuthRoutingModule,
	],
	exports: [RouterModule],
})
export class SneatAppRoutingModule {}
