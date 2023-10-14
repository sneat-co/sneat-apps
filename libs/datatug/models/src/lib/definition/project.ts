import { IStore } from './store';
import { IEnvironmentFull } from './environments';
import { IDbModelFull } from './dbmodels';
import { IProjDbServerFull } from './apis/database';

export type ProjectAccess = 'private' | 'protected' | 'public';

export enum ProjectItem {
	agent = 'agent',
	dbModel = 'dbModel',
	environment = 'environment',
	entity = 'entity',
	Board = 'board',
	query = 'query',
	variable = 'variable',
}

export type ProjectItemType = `${ProjectItem}`;

export interface IProjectBase {
	id: string;
	title: string;
	access: ProjectAccess;
}

export interface IProjectFull extends IProjectBase {
	environments?: IEnvironmentFull[];
	dbModels?: IDbModelFull[];
	dbServers: IProjDbServerFull[];
}

export interface IProjectSummary extends IProjectBase {
	readonly boards?: IProjBoard[];
	readonly dbModels?: IProjDbModelBrief[];
	readonly entities?: IProjEntity[];
	readonly environments?: IProjEnv[];
	readonly agents?: IStore[];
	readonly tags?: { [tag: string]: number };
	readonly default?: {
		readonly agent?: string;
	};
}

export interface IProjItemBrief {
	id: string;
	title?: string;
}

export interface IProjItemsFolder {
	id: string;
	folders?: IProjItemsFolder[];
	items?: IProjItemBrief[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProjBoard extends IProjItemBrief {
	//
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProjDbModelBrief extends IProjItemBrief {
	numberOf?: IProjDbModelNumbers;
}

export interface IProjDbModelNumbers {
	schemas?: number;
	tables?: number;
	views?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProjEntity extends IProjItemBrief {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IProjEnv extends IProjItemBrief {
}

export interface IProjectApp {
	id: string;
	name: string;
}

export interface IApiDefinition {
	type: 'web' | 'db';
	id: string;
	title?: string;
	tags?: string[];
	endpointPattern?: string;
	server?: { host: string; port: number };
}

export type FieldType = string | number;

export interface IDefaultValues {
	[entity: string]: {
		[field: string]: FieldType;
	};
}
