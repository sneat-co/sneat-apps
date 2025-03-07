import { NgModule } from '@angular/core';
import {
	getStandardSneatProviders,
	provideAppInfo,
	provideRolesByType,
	SneatApplicationModule,
	CapacitorHttpInterceptor,
} from '@sneat/app';
import { provideSentryAppInitializer } from '@sneat/logging';
import { SpacesMenuComponent } from '@sneat/team-components';
import { sneatAppEnvironmentConfig } from '../environments/environment';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [SneatAppComponent],
	imports: [
		...SneatApplicationModule.defaultSneatApplicationImports(),
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
