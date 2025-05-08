import { BrowserModule } from '@angular/platform-browser';
import { SneatLoggingModule } from '@sneat/logging';

// import { RandomModule } from '@sneat/random';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { SpaceServiceModule } from '@sneat/space-services';

export function getStandardSneatImports() {
	return [
		BrowserModule,
		BrowserAnimationsModule, // TODO: Move to specific modules?
		SneatLoggingModule,
		// SpaceServiceModule, // Move to specific modules?
		// RandomModule, // Move to specific modules?
	];
}
