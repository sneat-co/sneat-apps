export interface ILogger {
	// tslint:disable-next-line:no-any
	debug(...v: any[]): void;
	// tslint:disable-next-line:no-any
	info(...v: any[]): void;
	// tslint:disable-next-line:no-any
	warn(...v: any[]): void;
	// tslint:disable-next-line:no-any
	error(...v: any[]): void;
}

export interface ILoggerFactory {
	getLogger(name: string): ILogger;
}

export const loggerFactory: ILoggerFactory = {
	getLogger(name: string): ILogger {
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
	}
};
