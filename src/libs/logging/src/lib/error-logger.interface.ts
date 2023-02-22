import { InjectionToken } from '@angular/core';

export interface ILogErrorOptions {
	readonly report?: boolean;
	readonly feedback?: boolean;
	readonly show?: boolean;
	readonly showDuration?: number;
}

export interface IErrorLogger {
	logError(e: unknown, message?: string, options?: ILogErrorOptions): void;

	logErrorHandler(
		message?: string,
		options?: ILogErrorOptions,
	): (error: unknown) => void;
}

export const ErrorLogger = new InjectionToken<IErrorLogger>('IErrorLogger');
