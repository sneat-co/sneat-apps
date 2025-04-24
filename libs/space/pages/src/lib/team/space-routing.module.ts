import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactusRoutes } from '@sneat/contactus-internal';
import { spacePagesRoutes } from '@sneat/ext-debtus-internal';
import { AssetusRoutingModule } from '@sneat/extensions-assetus-pages';
import { budgetusRoutes } from '@sneat/extensions-budgetus';
import { docusRoutes } from '@sneat/extensions-docus';
import { listusRoutes } from '@sneat/extensions-listus';
import { calendariumRoutes } from '@sneat/extensions-schedulus-main';
import { trackusSpaceRoutes } from '@sneat/extensions-trackus';
import {
	SpaceComponentBaseParams,
	SpaceMenuComponent,
} from '@sneat/space-components';

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
	imports: [RouterModule.forChild(routes), AssetusRoutingModule],
	exports: [RouterModule],
	providers: [SpaceComponentBaseParams],
})
export class SpaceRoutingModule {}
