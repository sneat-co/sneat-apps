import { Provider } from '@angular/core';
import {
	CONTACT_ROLES_BY_TYPE,
	ContactRolesByType,
} from './contact-extensions';
import { APP_INFO, IAppInfo } from '@sneat/core';

export function provideAppInfo(appInfo: IAppInfo): Provider {
	return {
		provide: APP_INFO,
		useValue: appInfo,
	};
}

export function provideRolesByType(
	contactRolesByType: ContactRolesByType | undefined,
): Provider {
	return {
		provide: CONTACT_ROLES_BY_TYPE, // at the moment this is supplied by Logistus app only
		useValue: contactRolesByType,
	};
}
