import { init } from '@sentry/angular';
import { browserTracingIntegration } from '@sentry/browser';

export function initSentry(isProductionMode: boolean): void {
	if (!isProductionMode) {
		console.log('Sentry.io logging is disabled as NOT IN PRODUCTION mode');
	}

	console.log('Initializing Sentry.io as IN PRODUCTION mode');

	init({
		dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
		integrations: [browserTracingIntegration()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
}
