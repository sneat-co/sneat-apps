import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import {
	CONTACT_ROLES_BY_TYPE,
	ContactRolesByType,
	getStandardSneatImports,
	getStandardSneatProviders,
} from '@sneat/app';
import { AuthMenuItemComponent } from '@sneat/components';
import { APP_INFO, IAppInfo } from '@sneat/core';
import { initSentry } from '@sneat/logging';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { SpacesMenuComponent } from '@sneat/space-components';
import { environment } from '../environments/environment';
import { LogistAppRoutingModule } from './logist-app-routing.module';

import { LogistAppComponent } from './logist-app.component';

initSentry();

// initFirebase(environment.firebaseConfig);

const appInfo: IAppInfo = {
	appId: 'logist',
	appTitle: 'Logistus.app',
	requiredSpaceType: 'company',
};

console.log('logist-app.module: environment:', environment);

const contactRolesByType: ContactRolesByType = {
	company: [
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{
			id: 'consignee',
			title: 'Consignee',
			canBeImpersonatedByRoles: ['buyer', 'freight_agent', 'receive_agent'],
		},
		{
			id: 'dispatcher',
			title: 'Dispatcher',
			canBeImpersonatedByRoles: ['dispatch_agent'],
		},
		{ id: 'dispatch_agent', title: 'Dispatch Agent', iconName: 'body-outline' },
		{ id: 'receive_agent', title: 'Receive Agent', iconName: 'body-outline' },
		{ id: 'freight_agent', title: 'Freight Agent', iconName: 'train-outline' },
		{
			id: 'notify_party',
			title: 'Notify Party',
			canBeImpersonatedByRoles: ['buyer', 'freight_agent', 'receive_agent'],
		},
		{ id: 'port', title: 'Port' },
		{ id: 'shipper', title: 'Shipper' },
		{ id: 'shipping_line', title: 'Shipping Line' },
		{ id: 'trucker', title: 'Trucker' },
	],
	person: [
		{ id: 'driver', title: 'Driver', childForRoles: ['trucker'] },
		{
			id: 'employee',
			title: 'Driver',
			childForRoles: [
				'dispatch_agent',
				'receive_agent',
				'buyer',
				'freight_agent',
				'consignee',
				'dispatcher',
				'notify_party',
				'trucker',
				'shipper',
				'shipping_line',
			],
		},
	],
	location: [
		{ id: 'port', title: 'Port' },
		{
			id: 'warehouse',
			title: 'Warehouse',
			childForRoles: ['buyer', 'shipper'],
		},
	],
	vehicle: [
		{ id: 'ship', title: 'Ship', childForRoles: ['shipping_line'] },
		{ id: 'truck', title: 'Truck', childForRoles: ['trucker'] },
	],
};

@NgModule({
	imports: [
		...getStandardSneatImports(),
		IonicModule.forRoot(),
		// SneatAuthServicesModule,
		AuthMenuItemComponent,
		SpacesMenuComponent,
		LogistAppRoutingModule,
	],
	providers: [
		...getStandardSneatProviders(environment),
		{
			provide: SneatApiBaseUrl,
			useValue: environment.firebaseConfig.emulator
				? 'http://localhost:4300/v0/'
				: DefaultSneatAppApiBaseUrl,
		},
		{
			provide: CONTACT_ROLES_BY_TYPE,
			useValue: contactRolesByType,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
		{
			provide: APP_INFO,
			useValue: appInfo,
		},
	],
	declarations: [LogistAppComponent],
	bootstrap: [LogistAppComponent],
})
export class LogistAppModule {}
