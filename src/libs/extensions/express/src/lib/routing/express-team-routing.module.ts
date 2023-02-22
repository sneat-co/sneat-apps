import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactusRoutingModule } from '@sneat/extensions/contactus';
import { membersRoutes } from '@sneat/extensions/memberus';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ExpressMenuModule } from '../components/express-menu/express-menu.module';
import { ExpressTeamMenuComponent } from '../components/express-team-menu/express-team-menu.component';

@Component({ template: 'empty component' })
export class EmptyComponent {
}

export const expressRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('../pages/express-team-page/express-team-page.module').then(m => m.ExpressTeamPageModule),
	},
	{
		path: '',
		outlet: 'menu',
		// loadChildren: () => import('../components/express-team-menu/express-team-menu.module').then(m => m.ExpressTeamMenuModule),
		component: ExpressTeamMenuComponent,
	},
	{
		path: 'orders',
		pathMatch: 'full',
		loadChildren: () => import('../pages/orders-page/express-orders-page.module').then(m => m.ExpressOrdersPageModule),
	},
	{
		path: 'order',
		pathMatch: 'full',
		redirectTo: 'orders',
	},
	{
		path: 'order/:orderID',
		loadChildren: () => import('../pages/order-page/express-order-page.module').then(m => m.ExpressOrderPageModule),
	},
	{
		path: 'order/:orderID/new-segments',
		loadChildren: () => import('../pages/new-segment/new-segment-page.module').then(m => m.NewSegmentPageModule),
	},
	{
		path: 'order/:orderID/print',
		loadChildren: () => import('../prints/order-print-routing.module').then(m => m.OrderPrintRoutingModule),
	},
	{
		path: 'new-company',
		loadChildren: () => import('../pages/new-company/new-express-company-page.module').then(m => m.NewExpressCompanyPageModule),
	},
	{
		path: 'new-order',
		loadChildren: () => import('../pages/new-order/new-express-order-page.module').then(m => m.NewExpressOrderPageModule),
	},
	...membersRoutes,
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(expressRoutes.map(r => ({ ...r, path: r.path?.replace('express/', '') }))),
		ExpressMenuModule,
		ContactusRoutingModule,
	],
	declarations: [
		EmptyComponent,
	],
	providers: [
		TeamComponentBaseParams,
	],
})
export class ExpressTeamRoutingModule {
}
