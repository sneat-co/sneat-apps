import { IEntityFieldRef } from './metapedia';
import { IFieldCheckDef, IRecordsetCheckDef } from './checks';
import { DataType } from './types';

export interface IRecordsetDef {
	name: string;
	columns: IFieldDef[]; // Mandatory as records does not make sense without columns
	checks?: IRecordsetCheckDef[];
}

export interface IFieldDef {
	name: string;
	type: DataType;
	meta?: IEntityFieldRef;
	hideIf?: IHideFieldIf;
	checks?: IFieldCheckDef[];
}

export interface IHideFieldIf {
	parameters?: string[];
}

// This is used to mark source of a field in Views, SP & queries
export interface IRecordsetFieldRef {
	recordset: string;
	field: string;
}
