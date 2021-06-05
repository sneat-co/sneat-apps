import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SNEAT_AUTH_GUARDS} from '@sneat/auth';
import {DatatugRoutingModule} from '@sneat/datatug/routes';
import {HelloWorldPageComponent} from "./hello-world-page.component";

const routes: Routes = [
	{
		path: 'hello-world',
		component: HelloWorldPageComponent,
	},
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
	// {
	//   path: 'my',
	//   ...SNEAT_AUTH_GUARDS,
	//   loadChildren: () => import('@sneat/datatug/pages/my').then(m => m.DatatugMyPageModule),
	// },
];

@NgModule({
	imports: [
		DatatugRoutingModule,
		RouterModule.forRoot(routes,
			// {preloadingStrategy: PreloadAllModules},
		),
	],
	exports: [RouterModule],
})
export class DatatugAppRoutingModule {
	constructor() {
		console.log('DatatugAppRoutingModule.constructor()');
	}
}
