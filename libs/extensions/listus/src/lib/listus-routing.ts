import { Route } from '@angular/router';
// import {AuthGuard} from '../../services/auth-guard.service';
// import {guardRoute} from '../../utils/guard-route';

export const listusRoutes: Route[] = [
  {
    path: 'lists',
    data: { title: 'Lists' },
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/lists/lists-page.component').then(
        (m) => m.ListsPageComponent,
      ),
    // ...guardRoute,
  },
  {
    path: 'list/:listType/:listID',
    data: { title: 'List' },
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/list/list-page.component').then(
        (m) => m.ListPageComponent,
      ),
  },
  // {   // TODO: How not to list dynamic components in routes?
  // 	path: 'new-list-dialog',
  // 	loadChildren: () => import('./pages/lists/new-list-dialog.module')
  // 		.then(m => m.NewListDialogModule),
  // 	// ...guardRoute,
  // },
  // {
  // 	path: 'list/:id',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // },
  // {
  // 	path: 'recipe',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // },
  // {
  // 	path: 'recipe/:id',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // },
  // {
  // 	path: 'recipes',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // },
  // {
  // 	path: 'rspv',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // },
  // {
  // 	path: 'buy',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // 	// ...guardRoute,
  // },
  // {
  // 	path: 'do',
  // 	// canActivate: [AuthGuard],
  // 	loadChildren: () => import('./pages/list/list.module')
  // 		.then(m => m.ListPageModule),
  // 	// ...guardRoute,
  // },
  // {
  // 	path: 'movie-info',
  // 	loadChildren: () => import('sneat-shared/extensions/listus/pages/movie-info/movie-info-page.module')
  // 		.then(m => m.MovieInfoPageModule),
  // },
];
