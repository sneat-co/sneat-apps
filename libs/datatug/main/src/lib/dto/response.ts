import { IRecordsetDef } from '../models/definition/recordset';
import { ICommandResponseItem } from './command-response';
import { IRecordsetResult } from './execute';

// export interface IRxCommandResponse {
//     elapsed?: number;
//
//     getItems(): Observable<ICommandResponseItem>;
// }

export interface ICommandHttpResponse extends ICommandResponseItem {
	status?: number;
}

export interface ICommandResponseWithRecordsets extends ICommandResponseItem {
	type: 'recordsets';
	value: IRecordsetDef[];
}

export interface ICommandResponseWithRecordset extends ICommandResponseItem {
	type: 'recordset';
	value: IRecordsetResult;
}

// export interface IOutputParameter extends ICommandResponseItem {
//     name: string;
//     value: string | number;
// }
//
// export type IRecord = { [col: string]: string | number };
//
// export interface IRecordset extends ICommandResponseItem {
//     rows: IRecord[];
//     page?: number; // 1-indexed?
//     total?: number;
// }
