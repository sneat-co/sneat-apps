import { InjectionToken } from '@angular/core';

export interface ILogger {
	debug(...v: unknown[]): void;

	info(...v: unknown[]): void;

	warn(...v: unknown[]): void;

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
			debug: console.log,
			info: console.log,
			error: console.error,
			warn: console.warn,
		};
	},
};
