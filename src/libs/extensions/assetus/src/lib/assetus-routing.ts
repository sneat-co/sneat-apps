import {Route} from '@angular/router';
import {guardRoute} from '../../utils/guard-route';

export const assetusRoutes: Route[] = [
	{
		path: 'assets-group',
		loadChildren: () => import('./pages/asset-group/asset-group.module')
			.then(m => m.AssetGroupPageModule),
		...guardRoute,
	},
	{
		path: 'assets',
		loadChildren: () => import('./pages/assets/assets.module')
			.then(m => m.AssetsPageModule),
		...guardRoute,
	},
	{
		path: 'asset',
		loadChildren: () => import('./pages/asset/asset.module')
			.then(m => m.AssetPageModule),
		...guardRoute,
	},
	{
		path: 'vehicle',
		loadChildren: () => import('./pages/asset/asset.module')
			.then(m => m.AssetPageModule),
		...guardRoute,
	},
	{
		path: 'property',
		loadChildren: () => import('./pages/asset/asset.module')
			.then(m => m.AssetPageModule),
		...guardRoute,
	},
	{
		path: 'real-estate',
		loadChildren: () => import('./pages/real-estate/real-estate.module')
			.then(m => m.RealEstatePageModule),
	},
	{
		path: 'real-estates',
		loadChildren: () => import('./pages/real-estates/real-estates.module')
			.then(m => m.RealEstatesPageModule),
		...guardRoute,
	},
	{
		path: 'new-asset',
		loadChildren: () => import('./add/asset-new/asset-new.module')
			.then(m => m.AssetNewPageModule),
		...guardRoute,
	},
	{
		path: 'add-vehicle',
		loadChildren: () => import('./add/asset-add-vehicle/asset-add-vehicle.module')
			.then(m => m.AssetAddVehiclePageModule),
		...guardRoute,
	},
	{
		path: 'add-dwelling',
		loadChildren: () => import('./add/asset-add-dwelling/asset-add-dwelling.module')
			.then(m => m.AssetAddDwellingPageModule),
		...guardRoute,
	},
];
