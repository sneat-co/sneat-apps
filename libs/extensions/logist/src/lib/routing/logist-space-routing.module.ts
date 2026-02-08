import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactusRoutes, membersRoutes } from '@sneat/contactus-internal';
import { calendariumRoutes } from '@sneat/extensions-schedulus-main';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { LogistSpaceMenuComponent } from '../components';

export const logistRoutes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () =>
			import('../pages/logist-team-page/logist-space-page.component').then(
				(m) => m.LogistSpacePageComponent,
			),
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('../pages/logist-team-settings-page/logist-space-settings-page.component').then(
				(m) => m.LogistSpaceSettingsPageComponent,
			),
	},
	{
		path: '',
		outlet: 'menu',
		// loadComponent: () => import('../components/logist-team-menu/logist-team-menu.component').then(m => m.LogistTeamMenuModule),
		component: LogistSpaceMenuComponent,
	},
	{
		path: 'orders',
		pathMatch: 'full',
		loadComponent: () =>
			import('../pages/orders-page/logist-orders-page.component').then(
				(m) => m.LogistOrdersPageComponent,
			),
	},
	{
		path: 'order',
		pathMatch: 'full',
		redirectTo: 'orders',
	},
	{
		path: 'order/:orderID',
		loadComponent: () =>
			import('../pages/order-page/logist-order-page.component').then(
				(m) => m.LogistOrderPageComponent,
			),
	},
	{
		path: 'order/:orderID/new-segments',
		loadComponent: () =>
			import('../pages/new-segment/new-segment-page.component').then(
				(m) => m.NewSegmentPageComponent,
			),
	},
	{
		path: 'order/:orderID/new-shipping-point',
		loadComponent: () =>
			import('../pages/new-shipping-point/new-shipping-point-page.component').then(
				(m) => m.NewShippingPointPageComponent,
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
		loadComponent: () =>
			import('../pages/new-company/new-logist-company-page.component').then(
				(m) => m.NewLogistCompanyPageComponent,
			),
	},
	{
		path: 'new-order',
		loadComponent: () =>
			import('../pages/new-order/new-logist-order-page.component').then(
				(m) => m.NewLogistOrderPageComponent,
			),
	},
	...contactusRoutes,
	...membersRoutes,
	...calendariumRoutes,
];

@NgModule({
	imports: [
		// CommonComponent,
		RouterModule.forChild(
			logistRoutes.map((r) =>
				Object.assign(r, { path: r.path?.replace(`logist/`, ``) }),
			),
		),
	],
	providers: [SpaceComponentBaseParams],
})
export class LogistSpaceRoutingModule {}
