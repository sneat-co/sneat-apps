import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'container-doc',
				loadComponent: () =>
					import('./container-doc/container-print-doc.component').then(
						(m) => m.ContainerPrintDocComponent,
					),
			},
			{
				path: 'shipping-doc',
				loadComponent: () =>
					import('./order-shipping-doc/order-shipping-doc.component').then(
						(m) => m.OrderShippingDocComponent,
					),
			},
			{
				path: 'expedition-doc',
				loadComponent: () =>
					import(
						'./order-expedition-print-doc/order-expedition-print-doc.component'
					).then((m) => m.OrderExpeditionPrintDocComponent),
			},
			{
				path: 'trucker-summary',
				loadComponent: () =>
					import(
						'./order-trucker-summary/order-trucker-summary.component'
					).then((m) => m.OrderTruckerSummaryComponent),
			},
		]),
	],
})
export class OrderPrintRoutingModule {}
