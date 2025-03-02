import { NgModule } from '@angular/core';
import {
	CONTACT_ROLES_BY_TYPE,
	getStandardSneatProviders,
	SneatApplicationModule,
} from '@sneat/app';
import { AppVersionComponent, AuthMenuItemComponent } from '@sneat/components';
import { APP_INFO, IAppInfo } from '@sneat/core';
import { provideSentryAppInitializer } from '@sneat/logging';
import { SpacesMenuComponent } from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
import { sneatAppEnvironmentConfig } from '../environments/environment';
// import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';

const appInfo: IAppInfo = {
	appId: 'sneat',
	appTitle: 'sneat.app',
};

@NgModule({
	declarations: [SneatAppComponent],
	imports: [
		...SneatApplicationModule.defaultSneatApplicationImports(),
		AppVersionComponent,
		// SneatAuthServicesModule,
		AuthMenuItemComponent,
		SpaceServiceModule,
		SpacesMenuComponent,
		SneatAppRoutingModule,
	],
	providers: [
		...getStandardSneatProviders(sneatAppEnvironmentConfig),
		provideSentryAppInitializer(),
		{
			provide: APP_INFO,
			useValue: appInfo,
		},
		{
			provide: CONTACT_ROLES_BY_TYPE, // at the moment this is supplied by Logistus app only
			useValue: undefined,
		},
	],
	bootstrap: [SneatAppComponent],
	// exports: [SneatAppMenuComponent],
})
export class SneatAppModule {
	constructor() {
		console.log('SneatAppModule.constructor()');
	}
}
