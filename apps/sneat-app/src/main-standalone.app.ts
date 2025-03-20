import { bootstrapApplication } from '@angular/platform-browser';
import { SneatAppComponent } from './app/sneat-app.component';
import { appConfig } from './app/sneat-app.config';

export function bootstrapAsStandaloneApp() {
	bootstrapApplication(SneatAppComponent, appConfig).catch((err) =>
		console.error(err),
	);
}
