import { InjectionToken } from '@angular/core';

export interface ILogger {
	// tslint:disable-next-line:no-any
	debug(...v: unknown[]): void;

	// tslint:disable-next-line:no-any
	info(...v: unknown[]): void;

	// tslint:disable-next-line:no-any
	warn(...v: unknown[]): void;

	// tslint:disable-next-line:no-any
	error(...v: unknown[]): void;
}

export interface ILoggerFactory {
	getLogger(name: string): ILogger;
}

export const LOGGER_FACTORY = new InjectionToken<ILoggerFactory>(
	'loggerFactory',
);

export const loggerFactory: ILoggerFactory = {
	getLogger(name: string): ILogger {
		if (!name) {
			throw new Error('Logger name is required');
		}
		return {
			// tslint:disable-next-line:no-unbound-method
			debug: console.log,
			// tslint:disable-next-line:no-unbound-method
			info: console.log,
			// tslint:disable-next-line:no-unbound-method
			error: console.error,
			// tslint:disable-next-line:no-unbound-method
			warn: console.warn,
		};
	},
};
