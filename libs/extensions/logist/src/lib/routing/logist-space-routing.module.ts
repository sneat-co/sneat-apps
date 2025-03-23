import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactusRoutes, membersRoutes } from '@sneat/contactus-internal';
import { calendariumRoutes } from '@sneat/extensions-schedulus-main';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { LogistSpaceMenuComponent } from '../components';

export const logistRoutes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () =>
			import('../pages/logist-team-page/logist-space-page.module').then(
				(m) => m.LogistSpacePageModule,
			),
	},
	{
		path: 'settings',
		loadChildren: () =>
			import(
				'../pages/logist-team-settings-page/logist-space-settings-page.module'
			).then((m) => m.LogistSpaceSettingsPageModule),
	},
	{
		path: '',
		outlet: 'menu',
		// loadChildren: () => import('../components/logist-team-menu/logist-team-menu.module').then(m => m.LogistTeamMenuModule),
		component: LogistSpaceMenuComponent,
	},
	{
		path: 'orders',
		pathMatch: 'full',
		loadChildren: () =>
			import('../pages/orders-page/logist-orders-page.module').then(
				(m) => m.LogistOrdersPageModule,
			),
	},
	{
		path: 'order',
		pathMatch: 'full',
		redirectTo: 'orders',
	},
	{
		path: 'order/:orderID',
		loadChildren: () =>
			import('../pages/order-page/logist-order-page.module').then(
				(m) => m.LogistOrderPageModule,
			),
	},
	{
		path: 'order/:orderID/new-segments',
		loadChildren: () =>
			import('../pages/new-segment/new-segment-page.module').then(
				(m) => m.NewSegmentPageModule,
			),
	},
	{
		path: 'order/:orderID/new-shipping-point',
		loadChildren: () =>
			import('../pages/new-shipping-point/new-shipping-point-page.module').then(
				(m) => m.NewShippingPointPageModule,
			),
	},
	{
		path: 'order/:orderID/print',
		loadChildren: () =>
			import('../prints/order-print-routing.module').then(
				(m) => m.OrderPrintRoutingModule,
			),
	},
	{
		path: 'new-company',
		loadChildren: () =>
			import('../pages/new-company/new-logist-company-page.module').then(
				(m) => m.NewLogistCompanyPageModule,
			),
	},
	{
		path: 'new-order',
		loadChildren: () =>
			import('../pages/new-order/new-logist-order-page.module').then(
				(m) => m.NewLogistOrderPageModule,
			),
	},
	...contactusRoutes,
	...membersRoutes,
	...calendariumRoutes,
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(
			logistRoutes.map((r) => ({ ...r, path: r.path?.replace('logist/', '') })),
		),
	],
	providers: [SpaceComponentBaseParams],
})
export class LogistSpaceRoutingModule {}
