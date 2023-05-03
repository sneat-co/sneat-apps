import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactusRoutingModule } from '@sneat/extensions/contactus';
import { membersRoutes } from '@sneat/extensions/memberus';
import { schedulusRoutes } from '@sneat/extensions/schedulus/main';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { LogistMenuModule } from '../components/logist-menu/logist-menu.module';
import { LogistTeamMenuComponent } from '../components/logist-team-menu/logist-team-menu.component';

@Component({ template: 'empty component' })
export class EmptyComponent {
}

export const logistRoutes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadChildren: () => import('../pages/logist-team-page/logist-team-page.module').then(m => m.LogistTeamPageModule),
	},
	{
		path: 'settings',
		loadChildren: () => import('../pages/logist-team-settings-page/logist-team-settings-page.module').then(m => m.LogistTeamSettingsPageModule),
	},
	{
		path: '',
		outlet: 'menu',
		// loadChildren: () => import('../components/logist-team-menu/logist-team-menu.module').then(m => m.LogistTeamMenuModule),
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
		path: 'order/:orderID/new-shipping-point',
		loadChildren: () => import('../pages/new-shipping-point/new-shipping-point-page.module').then(m => m.NewShippingPointPageModule),
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
	...schedulusRoutes,
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(logistRoutes.map(r => ({ ...r, path: r.path?.replace('logist/', '') }))),
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
