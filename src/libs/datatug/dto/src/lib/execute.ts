import {ICommandResponse, IParameter, IRecordsetDefinition, NamedParams} from '@sneat/datatug/models';

export interface ISelectRequest {
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

export interface IRecordsetResult {
	duration: number;
	columns: IRecordsetColumn[];
	rows: RecordsetValue[][];
}

export interface IRecordset {
	def?: IRecordsetDefinition;
	result?: IRecordsetResult;
	parameters?: IParameter[];
}

export type DbType = 'UNIQUEIDENTIFIER' | 'NVARCHAR' | string;

export interface IRecordsetColumn {
	name: string;
	title?: string;
	dbType: DbType;
}
