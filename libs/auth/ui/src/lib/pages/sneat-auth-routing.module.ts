import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'sign-in-from-email-link',
    loadComponent: () =>
      import('./sign-in-from-email-link/sign-in-from-email-link-page.component').then(
        (m) => m.SignInFromEmailLinkPageComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class SneatAuthRoutingModule {}
