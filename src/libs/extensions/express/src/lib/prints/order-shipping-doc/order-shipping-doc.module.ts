import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpressOrderServiceModule } from '../..';
import { OrderShippingDocComponent } from './order-shipping-doc.component';

const routes: Routes = [
	{
		path: '',
		component: OrderShippingDocComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		ExpressOrderServiceModule,
	],
	declarations: [
		OrderShippingDocComponent,
	],
})
export class OrderShippingDocModule {

}
