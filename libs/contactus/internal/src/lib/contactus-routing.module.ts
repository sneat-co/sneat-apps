import { Route } from '@angular/router';
import { memberRoutes, membersRoutes } from './members';
// import {guardRoute} from '../../utils/guard-route';

export const contactusRoutes: Route[] = [
	{
		path: 'contacts',
		loadComponent: () =>
			import('./pages/contacts/contacts-page.component').then(
				(m) => m.ContactsPageComponent,
			),
		// ...guardRoute,
	},
	{
		path: 'new-contact',
		loadComponent: () =>
			import('./pages').then((m) => m.NewContactPageComponent),
		// ...guardRoute,
	},
	{
		path: 'contact/:contactID',
		loadComponent: () => import('./pages').then((m) => m.ContactPageComponent),
		// ...guardRoute,
	},
	{
		path: 'contact/:contactID/new-location',
		loadComponent: () =>
			import('./pages').then((m) => m.NewLocationPageComponent),
		// ...guardRoute,
	},
	...memberRoutes,
	...membersRoutes,
	// {
	// 	path: 'applicants',
	// 	loadChildren: () => import('./pages/contacts/contacts-page.module')
	// 		.then(m => m.ContactsPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'tenants',
	// 	loadChildren: () => import('./pages/contacts/contacts-page.module')
	// 		.then(m => m.ContactsPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'landlords',
	// 	loadChildren: () => import('./pages/contacts/contacts-page.module')
	// 		.then(m => m.ContactsPageModule),
	// 	// ...guardRoute,
	// },
];
