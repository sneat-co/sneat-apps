import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { contactusRoutes } from '@sneat/contactus-internal';
import { spacePagesRoutes } from '@sneat/debtus-internal';
import { AssetusRoutingModule } from '@sneat/extensions/assetus/pages';
import { budgetusRoutes } from '@sneat/extensions/budgetus';
import { docusRoutes } from '@sneat/extensions/docus';
import { listusRoutes } from '@sneat/extensions/listus';

import { calendariumRoutes } from '@sneat/extensions/schedulus/main';
import {
	SpaceComponentBaseParams,
	SpaceMenuComponent,
} from '@sneat/team-components';

const routes: Routes = [
	{
		path: '',
		// pathMatch: 'full',
		component: SpaceMenuComponent,
		outlet: 'menu',
	},
	{
		path: '',
		// pathMatch: 'full',
		loadComponent: () =>
			import('./team-page/space-page.component').then(
				(m) => m.SpacePageComponent,
			),
	},
	...contactusRoutes,
	...spacePagesRoutes,
	// {
	// 	path: '',
	// 	loadChildren: () =>
	// 		import('@sneat/contactus-internal').then((m) => m.ContactusRoutingModule),
	// },
	...budgetusRoutes,
	...docusRoutes,
	...listusRoutes,
	...calendariumRoutes,
	// ...expressRoutes,
	// {
	// 	path: '',
	// 	component: SpacePageComponent, // intentionally not lazy loading
	// 	pathMatch: 'full',
	// 	children: [
	// 		{
	// 			path: '',
	// 			pathMatch: 'full',
	// 			loadChildren: () => import('./team-page/team-page.module').then(m => m.SpacePageModule),
	// 		},
	// 	],
	// },
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		IonicModule,
		AssetusRoutingModule,
	],
	exports: [RouterModule],
	declarations: [],
	providers: [SpaceComponentBaseParams],
})
export class SpaceRoutingModule {}
