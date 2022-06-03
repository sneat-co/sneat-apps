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
				loadChildren: () => import('@sneat/user').then(m => m.UserMyPageRoutingModule),
			}
		])
	]
})
export class SneatAppMyRoutingModule {

}
