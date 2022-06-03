import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserMyPageComponent } from './user-my-page.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path: '', pathMatch: 'full', component: UserMyPageComponent},
		]),
	],
})
export class UserMyPageRoutingModule {
	constructor() {
		console.log('UserMyPageRoutingModule.constructor()');
	}
}
console.log('UserMyPageRoutingModule loaded');
