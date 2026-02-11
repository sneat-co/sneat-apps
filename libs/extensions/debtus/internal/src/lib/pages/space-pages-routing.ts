import { Route } from '@angular/router';

export const spacePagesRoutes: Route[] = [
  {
    path: 'debts',
    data: { title: 'Debts' },
    loadComponent: () =>
      import('./debtus-home/debtus-home-page.component').then(
        (m) => m.DebtusHomePageComponent,
      ),
  },
];
