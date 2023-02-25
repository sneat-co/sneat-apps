// (C) https://datatug.app

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DatatugAppModule } from './app/datatug-app.module';

platformBrowserDynamic()
	.bootstrapModule(DatatugAppModule)
	.catch((err) => console.error(err));
