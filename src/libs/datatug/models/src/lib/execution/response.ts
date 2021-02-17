import {Observable} from 'rxjs';
import {IRecordset} from '../definition/recordset';

export interface ICommandResponse {
	readonly commandId: string;
	readonly elapsed?: number;
	readonly items: Observable<ICommandResponseItem>;
}

// export interface IRxCommandResponse {
//     elapsed?: number;
//
//     getItems(): Observable<ICommandResponseItem>;
// }

export interface ICommandResponseItem {
	type: 'recordset' | 'recordsets' | 'string' | 'integer' | 'object';
	elapsed?: number;
	value?: any;
}

export interface ICommandHttpResponse extends ICommandResponseItem {
	status?: number;
}

export interface ICommandResponseWithRecordsets extends ICommandResponseItem {
	type: 'recordsets';
	value: IRecordset[];
}

export interface ICommandResponseWithRecordset extends ICommandResponseItem {
	type: 'recordset';
	value: IRecordset;
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
