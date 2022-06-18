import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SneatAppModule } from './app/sneat-app.module';
import { environment } from './environments/environment';

if (environment.production) {
	console.log('main.ts: PRODUCTION mode')
	enableProdMode();
} else {
	console.log('main.ts: NOT PRODUCTION mode')
}

platformBrowserDynamic()
	.bootstrapModule(SneatAppModule)
	.catch((err) => console.error(err));
