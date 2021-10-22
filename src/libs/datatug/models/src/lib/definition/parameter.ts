import { IEntityFieldRef } from './metapedia/entity';
import { DataType } from './types';

export interface IParameterDef {
	readonly id: string;
	readonly type: DataType;
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

export type ParameterValueType = DataType;

export type ParameterValue =
	| boolean
	| boolean[]
	| string
	| string[]
	| number
	| number[];

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
	readonly type: 'boolean';
	readonly value: boolean;
}
