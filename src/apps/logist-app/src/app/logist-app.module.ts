import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { CONTACT_ROLES_BY_TYPE, ContactRolesByType, ImportFirebaseModules, SneatApplicationModule } from '@sneat/app';
import { AuthMenuItemModule, SneatAuthServicesModule } from '@sneat/auth';
import { CommunesUiModule } from '@sneat/communes/ui';
import { APP_INFO, coreProviders, IAppInfo } from '@sneat/core';
import { initSentry } from '@sneat/logging';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { environment } from '../environments/environment';
import { LogistAppRoutingModule } from './logist-app-routing.module';

import { LogistAppComponent } from './logist-app.component';

initSentry();

// initFirebase(environment.firebaseConfig);

const appInfo: IAppInfo = {
	appId: 'logist',
	appTitle: 'Logistus.app',
	requiredTeamType: 'company',
};

console.log('logist-app.module: environment:', environment);

const firebaseModules = ImportFirebaseModules(environment.firebaseConfig);

console.log('firebaseModules', firebaseModules);

const contactRolesByType: ContactRolesByType = {
	'company': [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline', canBeRoles: ['shipper'] },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline', canBeRoles: ['consignee', 'notify_party'] },
		{ id: 'carrier', title: 'Carrier', iconName: 'train-outline' },
		{ id: 'consignee', title: 'Consignee' },
		{ id: 'dispatcher', title: 'Dispatcher' },
		{ id: 'notify_party', title: 'Notify Party' },
		{ id: 'port', title: 'Port', canBeRoles: ['port_from', 'port_to'] },
		{ id: 'trucker', title: 'Trucker' },
		{ id: 'shipper', title: 'Shipper' },
		{ id: 'shipping_line', title: 'Shipping Line' },
	],
	'person': [
		{ id: 'driver', title: 'Driver', childForRoles: ['trucker'] },
		{
			id: 'employee',
			title: 'Driver',
			childForRoles: ['agent', 'buyer', 'carrier', 'consignee', 'dispatcher', 'notify_party', 'trucker', 'shipper', 'shipping_line'],
		},
	],
	'location': [
		{ id: 'port', title: 'Port' },
		{ id: 'warehouse', title: 'Warehouse', childForRoles: ['buyer', 'shipper'] },
	],
	'vehicle': [
		{ id: 'ship', title: 'Ship', childForRoles: ['shipping_line'] },
		{ id: 'truck', title: 'Truck', childForRoles: ['trucker'] },
	],
};

@NgModule({
	imports: [
		...firebaseModules,
		BrowserAnimationsModule,
		SneatApplicationModule.defaultSneatApplicationImports(environment),
		SneatAuthServicesModule,
		AuthMenuItemModule,
		CommunesUiModule,
		TeamsMenuComponentModule,
		LogistAppRoutingModule,
	],
	providers: [
		...coreProviders,
		{
			provide: SneatApiBaseUrl,
			useValue: environment.useEmulators ? 'http://localhost:4300/v0/' : DefaultSneatAppApiBaseUrl,
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
	declarations: [
		LogistAppComponent,
	],
	bootstrap: [LogistAppComponent],
})
export class LogistAppModule {
}
