import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInFromEmailLinkPageComponent } from './sign-in-from-email-link-page.component';


const routes: Routes = [
	{
		path: '',
		component: SignInFromEmailLinkPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SignInFromEmailLinkPageRoutingModule {
}
