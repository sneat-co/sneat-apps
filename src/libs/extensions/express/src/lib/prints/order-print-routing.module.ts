import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'shipping-doc',
				loadChildren: () => import('./order-shipping-doc/order-shipping-doc.module').then(m => m.OrderShippingDocModule),
			},
			{
				path: 'expedition-doc',
				loadChildren: () => import('./order-expedition-print-doc/order-expedition-print-doc.module').then(m => m.OrderExpeditionPrintDocModule),
			},
		]),
	],
})
export class OrderPrintRoutingModule {

}
