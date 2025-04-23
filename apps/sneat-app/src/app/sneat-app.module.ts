import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	IonApp,
	IonContent,
	IonHeader,
	IonIcon,
	IonMenu,
	IonRouterOutlet,
	IonSplitPane,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { getStandardSneatImports } from '@sneat/app';
import { SpacesMenuComponent } from '@sneat/space-components';
import { sneatAppEnvironmentConfig } from '../environments/environment';
import { getProviders } from '../main-providers';
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
		IonicModule.forRoot(),
		SpacesMenuComponent,
		SneatAppRoutingModule,
		IonRouterOutlet,
		IonContent,
		IonMenu,
		IonSplitPane,
		IonApp,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonIcon,
		// HttpClientModule, // This is needed so we can define HTTP_INTERCEPTORS
	],
	providers: [...getProviders()],
	bootstrap: [SneatAppComponent],
})
export class SneatAppModule {
	constructor() {
		console.log('SneatAppModule.constructor()');
	}
}
