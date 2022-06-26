import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'shipping-doc',
				loadChildren: () => import('./order-shipping-doc/order-shipping-doc.module').then(m => m.OrderShippingDocModule),
			},
		]),
	],
})
export class OrderPrintRoutingModule {

}
