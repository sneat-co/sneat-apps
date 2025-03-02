import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { SneatAnalyticsModule } from '@sneat/core';
import { SneatLoggingModule } from '@sneat/logging';
import { RandomModule } from '@sneat/random';
import { SpaceServiceModule } from '@sneat/team-services';
import { AppComponentService } from './app-component.service';

@NgModule({
	imports: [CommonModule, SneatLoggingModule, SneatAnalyticsModule],
	providers: [
		AppComponentService,
		provideHttpClient(), // TODO: Move to specific modules?
	],
})
export class SneatApplicationModule {
	public static defaultSneatApplicationImports() {
		return [
			BrowserModule,
			BrowserAnimationsModule, // TODO: Move to specific modules?
			IonicModule.forRoot(), // TODO: Move to specific modules?
			RandomModule, // TODO: Move to specific modules?
			SneatApplicationModule,
			SpaceServiceModule,
		];
	}
}
