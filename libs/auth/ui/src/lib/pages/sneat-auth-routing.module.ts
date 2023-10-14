import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'login',
		loadChildren: () =>
			import('./login-page').then((m) => m.LoginPageComponentModule),
	},
	{
		path: 'sign-in-from-email-link',
		loadChildren: () =>
			import('./sign-in-from-email-link/sign-in-from-email-link-page.module')
				.then(m => m.SignInFromEmailLinkPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SneatAuthRoutingModule {
}
