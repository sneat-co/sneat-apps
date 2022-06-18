import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule, SneatAuthServicesModule } from '@sneat/auth';
import { RandomModule } from '@sneat/random';
import { environment } from '../../../../apps/sneat-app/src/environments/environment';
import { AppComponentService } from './app-component.service';
import { SneatLoggingModule } from '@sneat/logging';
import { SneatAnalyticsModule } from '@sneat/analytics';
import { IEnvironmentConfig } from './environment-config';

@NgModule({
	imports: [
		CommonModule,
		SneatLoggingModule,
		SneatAnalyticsModule,
	],
	providers: [
		AppComponentService,
	],
})
export class SneatApplicationModule {
	static defaultSneatApplicationImports(environmentConfig: IEnvironmentConfig) {
		// console.log('defaultSneatApplicationImports()', environmentConfig);
		return [
			BrowserModule,
			BrowserAnimationsModule,
			HttpClientModule, // TODO: Move to specific modules
			IonicModule.forRoot(),
			AngularFireModule.initializeApp(environmentConfig.firebaseConfig),
			RandomModule,
			SneatApplicationModule,
		];
	}
}
