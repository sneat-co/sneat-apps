import {IOptionallyTitled} from '../../core';
import {ParameterType} from '../parameter';

export interface IEntity extends IOptionallyTitled {
	extends?: { def: string };
	fields: IEntityField[];
	sourceOfRecord?: {
		db: string;
		objType: 'table';
		objName: string;
	};
	options?: {
		sources?: {
			contentType: 'json' | 'csv' | 'xml';
			url: string;
			source: string;
			mapping: { [id: string]: string };
		}[];
	};
}

export interface IEntityField {
	readonly id: string;
	readonly type: ParameterType;
	readonly namePattern?: { regexp: string } | { wildcard: string };
}

export interface IEntityFieldRef {
	entity: string;
	field: string;
}

