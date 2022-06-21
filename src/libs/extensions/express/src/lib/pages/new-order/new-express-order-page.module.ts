import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewExpressOrderPageComponent } from './new-express-order-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewExpressOrderPageComponent,
			},
		]),
	],
	declarations: [
		NewExpressOrderPageComponent,
	],
})
export class NewExpressOrderPageModule {

}
