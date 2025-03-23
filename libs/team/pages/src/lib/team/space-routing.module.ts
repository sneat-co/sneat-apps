import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { contactusRoutes } from '@sneat/contactus-internal';
import { spacePagesRoutes } from '@sneat/debtus-internal';
import { AssetusRoutingModule } from '@sneat/extensions-assetus-pages';
import { budgetusRoutes } from '@sneat/extensions-budgetus';
import { docusRoutes } from '@sneat/extensions-docus';
import { listusRoutes } from '@sneat/extensions-listus';

import { calendariumRoutes } from '@sneat/extensions-schedulus-main';
import { trackusSpaceRoutes } from '@sneat/extensions-trackus';
import {
	SpaceComponentBaseParams,
	SpaceMenuComponent,
} from '@sneat/team-components';

const routes: Routes = [
	{
		path: '',
		// pathMatch: 'full', -- for all routes
		component: SpaceMenuComponent,
		outlet: 'menu',
	},
	{
		path: '',
		data: { title: 'Space' },
		// pathMatch: 'full',
		loadComponent: () =>
			import('./team-page/space-page.component').then(
				(m) => m.SpacePageComponent,
			),
	},
	...contactusRoutes,
	...spacePagesRoutes,
	...budgetusRoutes,
	...docusRoutes,
	...listusRoutes,
	...calendariumRoutes,
	...trackusSpaceRoutes,
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
