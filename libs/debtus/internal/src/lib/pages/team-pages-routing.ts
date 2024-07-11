import { Route } from '@angular/router';

export const spacePagesRoutes: Route[] = [
	{
		path: 'debts',
		loadComponent: () =>
			import('./debtus-home/debtus-home-page.component').then(
				(m) => m.DebtusHomePageComponent,
			),
	},
];
