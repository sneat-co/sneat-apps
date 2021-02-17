import {IProjItemBrief} from './project';
import {IParameterDef} from './parameter';

export type FolderType = 'folder';
export type QueryType = 'SQL' | 'GraphQL';

export interface IQueryBase extends IProjItemBrief {
	type: FolderType | QueryType;
}

export interface IQueryFolder extends  IQueryBase {
	type: FolderType;
	queries: QueryItem[];
}

export interface IQueryDef extends IQueryBase {
	type: QueryType
	text: string;
	draft?: boolean;
	parameters?: IParameterDef[]
	targets?: IQueryTarget[];
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
