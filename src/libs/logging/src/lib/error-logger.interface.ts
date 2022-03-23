import { InjectionToken } from '@angular/core';

export interface ILogErrorOptions {
	readonly report?: boolean;
	readonly feedback?: boolean;
	readonly show?: boolean;
	readonly showDuration?: number;
}

export interface IErrorLogger {
	logError(e: any, message?: string, options?: ILogErrorOptions): void; // TODO: document why we need to return this: { error: any; message?: string; } | any;

	logErrorHandler(
		message?: string,
		options?: ILogErrorOptions,
	): (error: any) => void;
}

export const ErrorLogger = new InjectionToken<IErrorLogger>('IErrorLogger');
