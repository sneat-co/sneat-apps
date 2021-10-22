import { IProjItemBrief } from './project';
import { IParameterDef } from './parameter';
import { IRecordsetDef } from './recordset';
import { HttpMethod } from './command-definition';
import { IWidgetRef } from './widget';

export enum QueryType {
	HTTP = 'HTTP',
	SQL = 'SQL',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQueryItem extends IProjItemBrief {}

export interface IQueryFolder extends IQueryItem {
	folders?: IQueryFolder[];
	items?: IQueryDef[];
}

export interface IQueryFolderContext extends IQueryFolder {
	// TODO: document what & why
	path: string;
}

// Defines user's query
export interface IQueryDef extends IQueryItem {
	request: IQueryRequest;
	draft?: boolean;
	parameters?: IParameterDef[];
	dbModel?: string;
	targets?: IQueryTarget[];
	recordsets?: IRecordsetDef[];
	widgets?: IWidgetRef[];
}

// Defines request to some data without parameters
// We need it decouple from IQueryDef - why?
export interface IQueryRequest {
	queryType: QueryType; // for example: SQL, HTTP, etc.
}

// A base interface for queries that uses some text based language like SQL, GraphQL, etc.
export interface ITextQueryRequest extends IQueryRequest {
	text: string;
}

export interface ISqlQueryRequest extends ITextQueryRequest {
	queryType: QueryType.SQL;
}

export interface IHttpQueryRequest extends IQueryRequest {
	queryType: QueryType.HTTP;
	url: string;
	method: HttpMethod;
	body?: string;
}

export type QueryItem = IQueryDef | IQueryFolder;

export interface IQueryTarget {
	host?: string;
	port?: number;
	catalog?: string;
	credentials?: ICredentials;
}

export interface ICredentials {
	username: string;
}
