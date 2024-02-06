import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { contactusRoutes } from '@sneat/contactus-internal';
import { teamPagesRoutes } from '@sneat/debtus-internal';
import { AssetusRoutingModule } from '@sneat/extensions/assetus/pages';
import { budgetusRoutes } from '@sneat/extensions/budgetus';
import { docusRoutes } from '@sneat/extensions/docus';
import { listusRoutes } from '@sneat/extensions/listus';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { schedulusRoutes } from '@sneat/extensions/schedulus/main';
import {
	TeamComponentBaseParams,
	TeamMenuComponent,
} from '@sneat/team-components';

const routes: Routes = [
	{
		path: '',
		// pathMatch: 'full',
		component: TeamMenuComponent,
		outlet: 'menu',
	},
	{
		path: '',
		// pathMatch: 'full',
		loadComponent: () =>
			import('./team-page/team-page.component').then(
				(m) => m.TeamPageComponent,
			),
	},
	...contactusRoutes,
	...teamPagesRoutes,
	// {
	// 	path: '',
	// 	loadChildren: () =>
	// 		import('@sneat/contactus-internal').then((m) => m.ContactusRoutingModule),
	// },
	...budgetusRoutes,
	...docusRoutes,
	...listusRoutes,
	...schedulusRoutes,
	// ...expressRoutes,
	// {
	// 	path: '',
	// 	component: SpacePageComponent, // intentionally not lazy loading
	// 	pathMatch: 'full',
	// 	children: [
	// 		{
	// 			path: '',
	// 			pathMatch: 'full',
	// 			loadChildren: () => import('./team-page/team-page.module').then(m => m.TeamPageModule),
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
	providers: [TeamComponentBaseParams],
})
export class TeamSpaceRoutingModule {}
