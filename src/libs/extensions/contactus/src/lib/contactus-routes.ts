import { Route } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

export const contactusRoutes: Route[] = [
	{
		path: 'contact',
		loadChildren: () => import('./pages/contact/contact-page.module')
			.then(m => m.ContactPageModule),
		// ...guardRoute,
	},
	{
		path: 'applicants',
		loadChildren: () => import('./pages/contacts/contacts-page.module')
			.then(m => m.ContactsPageModule),
		// ...guardRoute,
	},
	{
		path: 'contacts',
		loadChildren: () => import('./pages/contacts/contacts-page.module')
			.then(m => m.ContactsPageModule),
		// ...guardRoute,
	},
	{
		path: 'tenants',
		loadChildren: () => import('./pages/contacts/contacts-page.module')
			.then(m => m.ContactsPageModule),
		// ...guardRoute,
	},
	{
		path: 'landlords',
		loadChildren: () => import('./pages/contacts/contacts-page.module')
			.then(m => m.ContactsPageModule),
		// ...guardRoute,
	},
	{
		path: 'new-contact',
		loadChildren: () => import('./pages/contact-new/contact-new-page.module')
			.then(m => m.ContactNewPageModule),
		// ...guardRoute,
	},
];
