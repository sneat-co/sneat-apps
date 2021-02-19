import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {routingParamTableId} from './datatug-routing-params';

export const datatugProjEnvDbRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('@sneat/datatug/pages/unsorted').then(m => m.EnvDbPageModule),
	},
	{
		path: 'table/:' + routingParamTableId,
		loadChildren: () => import('@sneat/datatug/pages/unsorted').then(m => m.EnvDbTablePageModule),
	},
	{
		path: 'view/:' + routingParamTableId,
		loadChildren: () => import('@sneat/datatug/pages/unsorted').then(m => m.EnvDbTablePageModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(datatugProjEnvDbRoutes)
	],
	exports: [
		RouterModule,
	],
})
export class DatatugProjEnvDbRoutingModule {
}
