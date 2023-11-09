import { Route } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

export const schedulusRoutes: Route[] = [
	{
		path: 'calendar',
		loadComponent: () =>
			import('./pages/calendar').then((m) => m.CalendarPageComponent),
		// ...guardRoute,
	},
	{
		path: 'new-happening',
		loadComponent: () =>
			import('./pages/new-happening').then((m) => m.NewHappeningPageComponent),
		// ...guardRoute,
	},
	{
		path: 'happening/:happeningID',
		loadComponent: () =>
			import('./pages/happening').then((m) => m.HappeningPageComponent),
		// ...guardRoute,
	},
	// {
	// 	path: 'new-task',
	// 	loadChildren: () => import('./new-happening/new-happening-page.module')
	// 		.then(m => m.NewHappeningPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'regular-task',
	// 	loadChildren: () => import('./happening/regular/regular-happening.page.module')
	// 		.then(m => m.RegularHappeningPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'task',
	// 	loadChildren: () => import('./happening/single/single-happening-page.module')
	// 		.then(m => m.SingleHappeningPageModule),
	// 	...guardRoute,
	// },
];
