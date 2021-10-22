export type CommandType = 'SQL' | 'HTTP';

export interface ICommandDefinition {
	readonly id: string;
	readonly type: CommandType;
	title: string;
}

export interface IHttpCommandDefinition extends ICommandDefinition {
	readonly type: 'HTTP';
	request: IHttpCommandRequestDefinition;
	settings?: IHttpCommandSettings;
}

export interface ISqlCommandDefinition extends ICommandDefinition {
	readonly type: 'SQL';
	request: IHttpCommandRequestDefinition;
	settings?: IHttpCommandSettings;
}

export interface IHttpCommandRequestDefinition {
	method: HttpMethod;
	url: string; // e.g. https://{env.}/some-path/{ctx.some-param}
	headers?: { [name: string]: string };
	body?: string;
}

export interface IHttpCommandSettings {
	// Verify SSL certificates when sending a request. Verification failures will result in the request being aborted.
	enableSslCertVerification?: boolean;

	// Follow HTTP 3xx responses as redirects.
	followRedirects?: boolean;

	// Redirect with the original HTTP method instead of the default behavior of redirecting with GET.
	followHttpMethod?: boolean;

	// Retain authorization header when a redirect happens to a different hostname.
	followAuthorizationHeader?: boolean;

	// Remove the referer header when a redirect happens.
	removeRefererHeader?: boolean;
}

export type HttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'COPY'
	| 'HEAD'
	| 'OPTIONS'
	| 'LINK'
	| 'UNLINK'
	| 'PURGE'
	| 'LOCK'
	| 'UNLOCK'
	| 'PROPFIND'
	| 'VIEW';
