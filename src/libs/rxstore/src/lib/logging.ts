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

