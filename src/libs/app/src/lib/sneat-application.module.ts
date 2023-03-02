import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { SneatAnalyticsModule } from '@sneat/analytics';
import { SneatLoggingModule } from '@sneat/logging';
import { RandomModule } from '@sneat/random';
import { AppComponentService } from './app-component.service';
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static defaultSneatApplicationImports(environmentConfig: IEnvironmentConfig) {
		// console.log('defaultSneatApplicationImports()', environmentConfig);
		return [
			BrowserModule,
			BrowserAnimationsModule,
			HttpClientModule, // TODO: Move to specific modules
			IonicModule.forRoot(),
			RandomModule,
			SneatApplicationModule,
		];
	}
}
