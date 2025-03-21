import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

const assetusRoutes: Route[] = [
	{
		path: 'asset',
		pathMatch: 'full',
		redirectTo: 'assets',
	},
	{
		path: 'assets',
		data: { title: 'Assets' },
		loadComponent: () => import('./assets').then((m) => m.AssetsPageComponent),
		// ...guardRoute,
	},
	{
		path: 'asset/:assetID',
		loadComponent: () => import('./asset').then((m) => m.AssetPageComponent),
		// ...guardRoute,
	},
	// {
	// 	path: 'assets-group',
	// 	loadChildren: () => import('./asset-group/asset-group.module')
	// 		.then(m => m.AssetGroupPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'vehicle/:assetID',
	// 	loadChildren: () => import('./asset/asset.module')
	// 		.then(m => m.AssetPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'property/:assetID',
	// 	loadChildren: () => import('./asset/asset.module')
	// 		.then(m => m.AssetPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'real-estate',
	// 	loadChildren: () => import('./real-estate/real-estate.module')
	// 		.then(m => m.RealEstatePageModule),
	// },
	// {
	// 	path: 'real-estates',
	// 	loadChildren: () => import('./real-estates/real-estates.module')
	// 		.then(m => m.RealEstatesPageModule),
	// 	// ...guardRoute,
	// },
	{
		path: 'new-asset',
		loadComponent: () =>
			import('./new-asset').then((m) => m.NewAssetPageComponent),
		// ...guardRoute,
	},
	// {
	// 	path: 'add-vehicle',
	// 	loadChildren: () => import('./add/asset-add-vehicle/asset-add-vehicle.module')
	// 		.then(m => m.AssetAddVehiclePageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'add-dwelling',
	// 	loadChildren: () => import('./add/asset-add-dwelling/asset-add-dwelling.module')
	// 		.then(m => m.AssetAddDwellingPageModule),
	// 	// ...guardRoute,
	// },
];

@NgModule({
	imports: [RouterModule.forChild(assetusRoutes)],
})
export class AssetusRoutingModule {}
