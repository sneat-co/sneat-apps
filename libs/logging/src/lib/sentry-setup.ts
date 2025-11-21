import { inject, provideAppInitializer, ErrorHandler } from '@angular/core';
import { TraceService, init, createErrorHandler } from '@sentry/angular';
import { Router } from '@angular/router';
import { BrowserOptions } from '@sentry/browser';

export const provideSentryAppInitializer = (options: BrowserOptions) => {
	initSentry(options);
	return [
		...sentryAppInitializerProviders,
		provideAppInitializer(() => {
			inject(TraceService);
		}),
	];
};

function initSentry(options: BrowserOptions): void {
	console.log('initSentry()');
	init(options);
}

const sentryAppInitializerProviders = [
	{
		provide: TraceService,
		deps: [Router],
	},
	{
		provide: ErrorHandler,
		useValue: createErrorHandler({
			showDialog: true,
		}),
	},
];
