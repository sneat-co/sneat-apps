import { BrowserModule } from '@angular/platform-browser';
import { SneatLoggingModule } from '@sneat/logging';

// import { CommonModule } from '@angular/common';
// import { RandomModule } from '@sneat/random';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SpaceServiceModule } from '@sneat/team-services';

export function getStandardSneatImports() {
	return [
		BrowserModule,
		SneatLoggingModule,
		// CommonModule,
		// SpaceServiceModule, // Move to specific modules?
		// BrowserAnimationsModule, // Move to specific modules?
		// RandomModule, // Move to specific modules?
	];
}
