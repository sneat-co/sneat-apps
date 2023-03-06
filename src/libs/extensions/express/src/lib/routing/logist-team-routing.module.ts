import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactusRoutingModule } from '@sneat/extensions/contactus';
import { membersRoutes } from '@sneat/extensions/memberus';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { LogistMenuModule } from '../components/express-menu/logist-menu.module';
import { LogistTeamMenuComponent } from '../components/express-team-menu/logist-team-menu.component';

@Component({ template: 'empty component' })
export class EmptyComponent {
}

export const expressRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('../pages/express-team-page/logist-team-page.module').then(m => m.LogistTeamPageModule),
	},
	{
		path: '',
		outlet: 'menu',
		// loadChildren: () => import('../components/express-team-menu/express-team-menu.module').then(m => m.ExpressTeamMenuModule),
		component: LogistTeamMenuComponent,
	},
	{
		path: 'orders',
		pathMatch: 'full',
		loadChildren: () => import('../pages/orders-page/logist-orders-page.module').then(m => m.LogistOrdersPageModule),
	},
	{
		path: 'order',
		pathMatch: 'full',
		redirectTo: 'orders',
	},
	{
		path: 'order/:orderID',
		loadChildren: () => import('../pages/order-page/logist-order-page.module').then(m => m.LogistOrderPageModule),
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
		loadChildren: () => import('../pages/new-company/new-logist-company-page.module').then(m => m.NewLogistCompanyPageModule),
	},
	{
		path: 'new-order',
		loadChildren: () => import('../pages/new-order/new-logist-order-page.module').then(m => m.NewLogistOrderPageModule),
	},
	...membersRoutes,
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(expressRoutes.map(r => ({ ...r, path: r.path?.replace('express/', '') }))),
		LogistMenuModule,
		ContactusRoutingModule,
	],
	declarations: [
		EmptyComponent,
	],
	providers: [
		TeamComponentBaseParams,
	],
})
export class LogistTeamRoutingModule {
}
