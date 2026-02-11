import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        data: { title: "User's profile" },
        loadComponent: () =>
          import('@sneat/user').then((m) => m.UserMyProfilePageComponent),
      },
      {
        path: 'spaces',
        data: { title: "User's spaces" },
        loadChildren: () =>
          import('@sneat/space-pages').then((m) => m.SpacesPageComponent),
      },
    ]),
  ],
})
export class SneatAppMyRoutingModule {}
