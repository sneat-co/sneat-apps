import {IProjItemBrief} from './project';
import {IParameterDef} from './parameter';
import {IRecordsetDefinition} from "./recordset";
import {HttpMethod} from "./command-definition";

export enum QueryType {
	HTTP = 'HTTP',
	SQL = 'SQL',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQueryItem extends IProjItemBrief {
}

export interface IQueryFolder extends IQueryItem {
	folders?: IQueryFolder[];
	items?: IQueryDef[];
}

export interface IQueryDef extends IQueryItem {
	request: IQueryRequest;
	draft?: boolean;
	parameters?: IParameterDef[];
	dbModel?: string;
	targets?: IQueryTarget[];
	recordsets?: IRecordsetDefinition[];
}

// Defines request to some data without parameters
// We need it decouple from IQueryDef - why?
export interface IQueryRequest {
	queryType: QueryType // for example: SQL, HTTP, etc.
}

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
