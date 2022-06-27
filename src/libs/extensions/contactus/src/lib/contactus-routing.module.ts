import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

export const contactusRoutes: Route[] = [
	{
		path: 'contacts',
		loadChildren: () => import('./pages/contacts/contacts-page.module')
			.then(m => m.ContactsPageModule),
		// ...guardRoute,
	},
	{
		path: 'new-contact',
		loadChildren: () => import('./pages')
			.then(m => m.NewContactPageModule),
		// ...guardRoute,
	},
	{
		path: 'contact/:contactID',
		loadChildren: () => import('./pages')
			.then(m => m.ContactPageModule),
		// ...guardRoute,
	},
	{
		path: 'contact/:contactID/new-location',
		loadChildren: () => import('./pages')
			.then(m => m.NewLocationPageModule),
		// ...guardRoute,
	},
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

@NgModule({
	imports: [
		RouterModule.forChild(contactusRoutes),
	],
})
export class ContactusRoutingModule {
}
