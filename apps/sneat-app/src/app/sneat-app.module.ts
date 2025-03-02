import { NgModule } from '@angular/core';
import {
	getStandardSneatProviders,
	provideAppInfo,
	provideRolesByType,
	SneatApplicationModule,
} from '@sneat/app';
import { provideSentryAppInitializer } from '@sneat/logging';
import { SpacesMenuComponent } from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
import { sneatAppEnvironmentConfig } from '../environments/environment';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';

@NgModule({
	declarations: [SneatAppComponent],
	imports: [
		...SneatApplicationModule.defaultSneatApplicationImports(),
		SpacesMenuComponent,
		SneatAppRoutingModule,
	],
	providers: [
		...getStandardSneatProviders(sneatAppEnvironmentConfig),
		provideSentryAppInitializer(),
		provideAppInfo({ appId: 'sneat', appTitle: 'sneat.app' }),
		provideRolesByType(undefined),
	],
	bootstrap: [SneatAppComponent],
})
export class SneatAppModule {
	constructor() {
		console.log('SneatAppModule.constructor()');
	}
}
