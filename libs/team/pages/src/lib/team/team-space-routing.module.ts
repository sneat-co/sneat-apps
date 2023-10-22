import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AssetusRoutingModule } from '@sneat/extensions/assetus/pages';
import { budgetusRoutes } from '@sneat/extensions/budgetus';
import { docusRoutes } from '@sneat/extensions/docus';
import { listusRoutes } from '@sneat/extensions/listus';
import { schedulusRoutes } from '@sneat/extensions/schedulus/main';
import {
	TeamComponentBaseParams,
	TeamMenuComponent,
} from '@sneat/team/components';

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
		loadChildren: () =>
			import('./team-page/team-page.module').then((m) => m.TeamPageModule),
	},
	{
		path: '',
		loadChildren: () =>
			import('@sneat/contactus-internal').then((m) => m.ContactusRoutingModule),
	},
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
