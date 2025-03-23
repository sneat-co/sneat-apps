import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		outlet: 'menu',
		loadComponent: () =>
			import('./sneat-app-menu-component/sneat-app-menu.component').then(
				(m) => m.SneatAppMenuComponent,
			),
	},
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () =>
			import('./pages/sneat-app-home-page/sneat-app-home-page.component').then(
				(m) => m.SneatAppHomePageComponent,
			),
	},
	{
		path: 'dev',
		loadComponent: () =>
			import('./pages/dev-page/dev-page.component').then(
				(m) => m.DevPageComponent,
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
