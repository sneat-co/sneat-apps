import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {routingParamDbCatalogId} from '@sneat/datatug/core';

export const datatugProjEnvRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('@sneat/datatug/pages/unsorted').then(m => m.EnvironmentPageModule),
	},
	{
		path: 'db/:' + routingParamDbCatalogId,
		loadChildren: () => import('@sneat/datatug/routes').then(m => m.DatatugProjEnvDbRoutingModule),
	},
	{
		path: 'servers',
		loadChildren: () => import('@sneat/datatug/pages/unsorted').then( m => m.ServersPageModule)
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(datatugProjEnvRoutes)
	],
	exports: [
		RouterModule,
	],
})
export class DatatugProjEnvRoutingModule {
}
