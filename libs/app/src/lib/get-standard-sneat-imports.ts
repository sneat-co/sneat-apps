import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { SneatLoggingModule } from '@sneat/logging';
import { RandomModule } from '@sneat/random';
import { SpaceServiceModule } from '@sneat/team-services';

export function getStandardSneatImports() {
	return [
		BrowserModule,
		BrowserAnimationsModule, // TODO: Move to specific modules?
		IonicModule.forRoot(), // TODO: Move to specific modules?
		RandomModule, // TODO: Move to specific modules?
		SpaceServiceModule,
		CommonModule,
		SneatLoggingModule,
	];
}
