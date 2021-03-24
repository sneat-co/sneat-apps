import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ServersPageComponent} from './servers-page.component';
import {routingParamDriver, routingParamDbServerId} from '@sneat/datatug/routes';

const routes: Routes = [
	{
		path: '',
		component: ServersPageComponent
	},
	{
		path: `db/:${routingParamDriver}/:${routingParamDbServerId}`,
		loadChildren: () => import('../dbserver/dbserver.module').then(m => m.DbserverPageModule)
	},
];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ServersPageRoutingModule {
}
