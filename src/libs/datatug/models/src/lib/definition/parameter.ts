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
	readonly id: string;
	readonly type: ParameterType;
	readonly title?: string;
	readonly maxLength?: number;
	readonly minLength?: number;
	readonly isRequired?: boolean;
	readonly isMultiValue?: boolean;
	readonly meta?: IEntityFieldRef;
	readonly lookup?: IParameterLookup;
}

export interface IParamWithDefAndValue {
	def: IParameterDef;
	val?: ParameterValue;
}

export interface IParameterLookup {
	readonly db: string;
	readonly sql: string;
	readonly keyFields: string[];
}

type ParameterValueType = ParameterType;

type ParameterValue = boolean | boolean[] | string | string[] | number | number[];

export interface IParameter {
	id: string;
	type: ParameterValueType;
	value?: ParameterValue;
}

export interface IParameterValueWithoutID {
	readonly type: ParameterValueType;
	value: ParameterValue;
}

export interface IParameterValueWithName extends IParameterValueWithoutID {
	readonly name: string;
}

export interface IStringParamValue extends IParameterValueWithoutID {
	readonly type: 'string' | 'UUID' | 'GUID';
	readonly value: string;
}

export interface INumberParamValue extends IParameterValueWithoutID {
	readonly type: 'integer' | 'number';
	readonly value: number;
}

export interface IBoolParamValue extends IParameterValueWithoutID {
	readonly type: 'bool';
	readonly value: boolean;
}

