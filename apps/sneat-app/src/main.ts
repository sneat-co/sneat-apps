import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { SneatAppModule } from './app/sneat-app.module';

platformBrowserDynamic()
	.bootstrapModule(SneatAppModule)
	.catch((err) => console.error(err));
