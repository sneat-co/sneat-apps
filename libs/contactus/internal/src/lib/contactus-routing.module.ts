import { Route } from '@angular/router';
import { memberRoutes, membersRoutes } from './members';
// import {guardRoute} from '../../utils/guard-route';

export const contactusRoutes: Route[] = [
	{
		path: 'contacts',
		data: { title: 'Contacts' },
		loadComponent: () =>
			import('./pages/contacts/contacts-page.component').then(
				(m) => m.ContactsPageComponent,
			),
		// ...guardRoute,
	},
	{
		path: 'new-contact',
		data: { title: 'New Contact' },
		loadComponent: () =>
			import('./pages').then((m) => m.NewContactPageComponent),
		// ...guardRoute,
	},
	{
		path: 'contact/:contactID',
		data: { title: 'Contact' },
		loadComponent: () => import('./pages').then((m) => m.ContactPageComponent),
		// ...guardRoute,
	},
	{
		path: 'contact/:contactID/new-location',
		data: { title: 'New location' },
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
