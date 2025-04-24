import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
	routingParamDbServerId,
	routingParamDriver,
} from '@sneat/ext-datatug-core';

const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./servers-page.component').then((m) => m.ServersPageComponent),
	},
	{
		path: `db/:${routingParamDriver}/:${routingParamDbServerId}`,
		loadComponent: () =>
			import('../dbserver/dbserver-page.component').then(
				(m) => m.DbserverPageComponent,
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ServersPageRoutingModule {}
