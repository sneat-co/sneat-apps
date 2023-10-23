import {
	IParameter,
	IRecordsetCheckDef,
	IRecordsetDef,
	NamedParams,
} from '@sneat/datatug-models';
import { ICommandResponse } from './response';

// import { IValueCheckResult } from '@sneat/datatug/checks';

export interface ISelectRequest {
	// TODO: document where & how it is used
	proj: string;
	env: string;
	db: string;
	from?: string;
	sql?: string;
	cols?: string;
	limit?: number;
	where?: string;
	namedParams?: NamedParams;
}

export interface IExecuteResponse {
	duration: number;
	commands: ICommandResponse[];
}

export type RecordsetValue = string | number | boolean;

export type IRecordsetRow = RecordsetValue[];

export interface IRecordsetCheckResult {
	def: IRecordsetCheckDef;
	ok: boolean;
	message?: string;
}

export interface IRecordsetCheckResults {
	recordset: IRecordsetCheckResult[];
	// byColumn: { [i: number]: { [row: number]: IValueCheckResult[] } };
}

export interface IRecordsetResult {
	duration?: number; // How long did it take to retrieve the recordset result
	columns: IRecordsetColumn[];
	rows: IRecordsetRow[];
	checkResults?: IRecordsetCheckResults;
}

export interface IRecordset {
	def?: IRecordsetDef;
	result?: IRecordsetResult;
	parameters?: IParameter[];
}

export type DbType = 'UNIQUEIDENTIFIER' | 'NVARCHAR' | string;

export interface IRecordsetColumn {
	name: string;
	title?: string;
	dbType: DbType;
}
