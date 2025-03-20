import { NgModule } from '@angular/core';
import {
	getStandardSneatImports,
	getStandardSneatProviders,
	provideAppInfo,
	provideRolesByType,
} from '@sneat/app';
import { provideSentryAppInitializer } from '@sneat/logging';
import { SpacesMenuComponent } from '@sneat/team-components';
import { sneatAppEnvironmentConfig } from '../environments/environment';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';
import posthog from 'posthog-js';

if (sneatAppEnvironmentConfig.posthog) {
	posthog.init(sneatAppEnvironmentConfig.posthog.posthogKey, {
		autocapture: true,
		api_host: sneatAppEnvironmentConfig.posthog.posthogHost,
		person_profiles: sneatAppEnvironmentConfig.posthog.person_profiles, // or 'always' to create profiles for anonymous users as well
	});
}

console.log('sneatAppEnvironmentConfig:', sneatAppEnvironmentConfig);

@NgModule({
	declarations: [SneatAppComponent],
	imports: [
		...getStandardSneatImports(),
		SpacesMenuComponent,
		SneatAppRoutingModule,
		// HttpClientModule, // This is needed so we can define HTTP_INTERCEPTORS
	],
	providers: [
		...getStandardSneatProviders(sneatAppEnvironmentConfig),
		// {
		// 	provide: HTTP_INTERCEPTORS,
		// 	useClass: CapacitorHttpInterceptor,
		// 	multi: true,
		// },
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
