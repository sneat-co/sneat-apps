import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { DatatugRoutingModule } from '@sneat/datatug-routes';
import { IonicRouteStrategy } from '@ionic/angular';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';

const routes: Routes = [
	{
		path: 'hello-world',
		loadChildren: () =>
			import('./hello-world-page.component').then(
				(m) => m.HelloWorldPageComponent,
			),
	},
	{
		path: 'home',
		loadChildren: () =>
			import('@sneat/datatug-pages').then((m) => m.DatatugHomePageComponent),
	},
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [
		DatatugRoutingModule,
		RouterModule.forRoot(
			routes,
			// {preloadingStrategy: PreloadAllModules},
		),
		SneatAuthRoutingModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
	],
	exports: [RouterModule],
})
export class DatatugAppRoutingModule {
	constructor() {
		console.log('DatatugAppRoutingModule.constructor()');
	}
}
