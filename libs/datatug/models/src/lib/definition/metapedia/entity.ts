import { IOptionallyTitled } from '../../core';
import { IFieldCheckDef } from '../checks';
import { DataType } from '../types';

export type EntityContentType = 'json' | 'csv' | 'xml';

export interface IEntity extends IOptionallyTitled {
	extends?: { def: string };
	fields: IEntityFieldDef[];
	sourceOfRecord?: {
		db: string;
		objType: 'table';
		objName: string;
	};
	options?: {
		sources?: {
			contentType: EntityContentType;
			url: string;
			source: string;
			mapping: Record<string, string>;
		}[];
	};
}

export interface IEntityFieldDef {
	readonly id: string;
	readonly type: DataType;
	readonly namePattern?: { regexp: string } | { wildcard: string };
	readonly checks?: IFieldCheckDef[];
}

export interface IEntityFieldRef {
	entity: string;
	field: string;
}
