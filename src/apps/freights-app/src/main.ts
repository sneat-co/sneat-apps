import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { FreightsAppModule } from './app/freights-app.module';

platformBrowserDynamic()
	.bootstrapModule(FreightsAppModule)
	.catch((err) => console.error(err));
