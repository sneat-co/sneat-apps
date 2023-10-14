import { Route } from '@angular/router';
// import { guardRoute } from '../../utils/guard-route';

export const budgetusRoutes: Route[] = [
	{
		path: 'budget',
		loadChildren: () =>
			import('./pages/budget/budget.module').then((m) => m.BudgetPageModule),
		// ...guardRoute,
	},
];
