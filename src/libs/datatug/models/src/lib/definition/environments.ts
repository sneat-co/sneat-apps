import { ITagged } from '../tags';
import { IDbServer } from './apis/database';

export interface IEnvironmentBase {
	id: string;
	title: string;
}

export interface IEnvironmentFull extends IEnvironmentBase {
	dbServer?: IEnvDbServer[];
}

export interface IEnvironmentSummary extends IEnvironmentBase {
	vars?: { [id: string]: string };
	connections?: { [id: string]: IConnection };
	dbServers?: IEnvDbServer[];
}

export interface IEnvDbServer extends IDbServer {
	id: string;
	title?: string;
	catalogs?: string[];
}

export interface IProjectEnv {
	webAPIs?: { [id: string]: IWebApiEnv };
}

export interface IWebApiEnv {
	protocol: 'http' | 'https';
	host: string;
	basePath?: string;
}

export interface IConnection extends ITagged {
	host: string;
	type: 'SQL';
	kind: 'MSSQL' | 'MySQL' | 'Oracle';
	port?: string;
	user?: string;
	database?: string;
	dataTugSchema?: string;
	integratedSecurity?: boolean | 'SSPI';
}

export interface IConnectionWithName extends IConnection {
	name?: string;
}
