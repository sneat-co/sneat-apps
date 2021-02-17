import {IEntityFieldRef} from './metapedia/entity';


export type ParameterType = 'bool'
	| 'string'
	| 'text'
	| 'number'
	| 'integer'
	| 'decimal'
	| 'float'
	| 'money'
	| 'boolean'
	| 'bit'
	| 'binary'
	| 'UUID'
	| 'GUID'
	| 'datetime'
	| 'date'
	;

export interface IParameterDef {
	readonly name: string;
	readonly title?: string;
	readonly type: ParameterType;
	readonly maxLength?: number;
	readonly minLength?: number;
	readonly isRequired?: boolean;
	readonly isMultiValue?: boolean;
	readonly meta?: IEntityFieldRef;
	readonly lookup?: IParameterLookup;
}

export interface IParameterLookup {
	readonly db: string;
	readonly sql: string;
	readonly keyFields: string[];
}

type ParameterValueType = ParameterType;

export interface IParameterValueWithoutName {
	readonly type: ParameterValueType;
	value: boolean | boolean[] | string | string[] | number | number[];
}

export interface IParameterValueWithName extends IParameterValueWithoutName {
	readonly name: string;
}

export interface IStringParamValue extends IParameterValueWithoutName {
	readonly type: 'string' | 'UUID' | 'GUID';
	readonly value: string;
}

export interface INumberParamValue extends IParameterValueWithoutName {
	readonly type: 'integer' | 'number';
	readonly value: number;
}

export interface IBoolParamValue extends IParameterValueWithoutName {
	readonly type: 'bool';
	readonly value: boolean;
}

