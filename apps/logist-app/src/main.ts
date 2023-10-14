import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { LogistAppModule } from './app/logist-app.module';

platformBrowserDynamic()
	.bootstrapModule(LogistAppModule)
	.catch((err) => console.error(err));
