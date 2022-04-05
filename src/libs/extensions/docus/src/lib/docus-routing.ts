import { Route } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

export const docusRoutes: Route[] = [
	{
		path: 'documents',
		loadChildren: () => import('./pages/documents/documents-page.module')
			.then(m => m.DocumentsPageModule),
		// ...guardRoute,
	},
	// {
	// 	path: 'document',
	// 	loadChildren: () => import('./pages/document/commune-document.module')
	// 		.then(m => m.CommuneDocumentPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'new-document',
	// 	loadChildren: () => import('./pages/document-new/document-new.module')
	// 		.then(m => m.DocumentNewPageModule),
	// 	// ...guardRoute,
	// },
];
