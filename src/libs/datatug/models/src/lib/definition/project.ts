import {IStore} from './store';
import {IOptionallyTitled} from '../core';
import {IEnvironmentFull} from './environments';
import {IDbModelFull} from './dbmodels';
import {IProjDbServerFull} from './apis/database';

// eslint-disable-next-line no-shadow
export enum ProjectItem {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Agent = 'agent',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	DbModel = 'dbmodel',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Environment = 'environment',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Entity = 'entity',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Board = 'board',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Variable = 'variable',
}

// eslint-disable-next-line no-shadow,@typescript-eslint/naming-convention
export const ProjectItems = [
	ProjectItem.Entity,
	ProjectItem.Board,
	ProjectItem.DbModel,
	ProjectItem.Agent,
	ProjectItem.Environment,
	ProjectItem.Variable,
] as const;

export type ProjectItemType = typeof ProjectItems[number];

export type ProjectAccess = 'private' | 'protected' | 'public';

export interface IDatatugProjectBase {
	id: string;
	title: string;
	access: ProjectAccess;
}

export interface IDatatugProjectFull extends IDatatugProjectBase {
	environments?: IEnvironmentFull[];
	dbModels?: IDbModelFull[];
	dbServers: IProjDbServerFull[];
}

export interface IDatatugProjectSummary extends IDatatugProjectBase {
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

export interface IProjItemBrief extends IOptionallyTitled {
	id: string;
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
	server?: { host: string; port: number; };
}

export type FieldType = string | number;

export interface IDefaultValues {
	[entity: string]: {
		[field: string]: FieldType;
	};
}
