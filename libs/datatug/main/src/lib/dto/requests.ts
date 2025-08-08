import { IDbServer } from '../models/definition/apis/database';
import { IPipeDefinition } from '../models/definition/pipe-definition';
import { NamedParams } from '../models/requests/command';
import { IProjectRef } from '../core/project-context';

export interface CreateNamedRequest {
	projectRef: IProjectRef;
	name: string;
}

export interface GetServerDatabasesRequest {
	project?: string;
	dbServer: IDbServer;
}

export interface IRequestCommand {
	id?: string;
	readonly type: 'SQL' | 'HTTP';
	namedParams?: NamedParams;
	pipes?: IPipeDefinition[];
}

export interface IHttpCommand {
	readonly type: 'HTTP';
	url: string;
}

export interface ISqlCommandRequest extends IRequestCommand {
	readonly type: 'SQL';
	text: string;
	env: string;
	db: string;
	driver?: string;
}
