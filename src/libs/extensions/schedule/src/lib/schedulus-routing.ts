import { Route } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

export const schedulusRoutes: Route[] = [
	{
		path: 'schedule',
		loadChildren: () => import('./pages/schedule/schedule-page.module')
			.then(m => m.SchedulePageModule),
		// ...guardRoute,
	},
	{
		path: 'new-activity',
		loadChildren: () => import('./pages/new-happening/new-happening-page.module')
			.then(m => m.NewHappeningPageModule),
		// ...guardRoute,
	},
	// {
	// 	path: 'new-task',
	// 	loadChildren: () => import('./new-happening/new-happening-page.module')
	// 		.then(m => m.NewHappeningPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'regular-activity',
	// 	loadChildren: () => import('./happening/regular/regular-happening.page.module')
	// 		.then(m => m.RegularHappeningPageModule),
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
