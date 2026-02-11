import { Route } from '@angular/router';
// import { guardRoute } from '../../utils/guard-route';

export const budgetusRoutes: Route[] = [
  {
    path: 'budget',
    data: { title: 'Budget' },
    loadComponent: () =>
      import('./pages/budget/budget-page.component').then(
        (m) => m.BudgetPageComponent,
      ),
    // ...guardRoute,
  },
];
