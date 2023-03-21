import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'container-doc',
				loadChildren: () => import('./container-doc/container-print-doc.module').then(m => m.ContainerPrintDocModule),
			},
			{
				path: 'shipping-doc',
				loadChildren: () => import('./order-shipping-doc/order-shipping-doc.module').then(m => m.OrderShippingDocModule),
			},
			{
				path: 'expedition-doc',
				loadChildren: () => import('./order-expedition-print-doc/order-expedition-print-doc.module').then(m => m.OrderExpeditionPrintDocModule),
			},
			{
				path: 'trucker-summary',
				loadChildren: () => import('./order-trucker-summary/order-trucker-summary.module').then(m => m.OrderTruckerSummaryModule),
			},
		]),
	],
})
export class OrderPrintRoutingModule {

}
