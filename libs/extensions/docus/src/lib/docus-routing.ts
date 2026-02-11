import { Route } from '@angular/router';
// import {guardRoute} from '../../utils/guard-route';

export const docusRoutes: Route[] = [
  {
    path: 'documents',
    data: { title: 'Documents' },
    loadComponent: () =>
      import('./pages/documents/documents-page.component').then(
        (m) => m.DocumentsPageComponent,
      ),
    // ...guardRoute,
  },
  // {
  // 	path: 'document',
  // 	loadChildren: () => import('./pages/document/commune-document.module')
  // 		.then(m => m.CommuneDocumentPageModule),
  // 	// ...guardRoute,
  // },
  {
    path: 'new-document',
    data: { title: 'New Document' },
    loadComponent: () =>
      import('./pages/document-new/new-document-page.component').then(
        (m) => m.NewDocumentPageComponent,
      ),
    // ...guardRoute,
  },
];
