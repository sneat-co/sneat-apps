import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserTracing } from '@sentry/tracing';

import { SneatAppModule } from './app/sneat-app.module';
import { environment } from './environments/environment';

import { init, instrumentAngularRouting } from '@sentry/angular';

if (environment.production) {

	init({
		dsn: "https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241",
		integrations: [
			new BrowserTracing({
				tracingOrigins: ["localhost", "https://sneat.app"],
				routingInstrumentation: instrumentAngularRouting,
			}),
		],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(SneatAppModule)
	.catch((err) => console.error(err));
