import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
	routingParamDbServerId,
	routingParamDriver,
} from '@sneat/datatug-core';

const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./servers-page.component').then((m) => m.ServersPageComponent),
	},
	{
		path: `db/:${routingParamDriver}/:${routingParamDbServerId}`,
		loadChildren: () =>
			import('../dbserver/dbserver.module').then((m) => m.DbserverPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ServersPageRoutingModule {}
