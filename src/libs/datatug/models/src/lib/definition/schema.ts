import {IRecordsetDefinition} from './recordset';
import {IOptionallyTitled} from '../core';

export interface ISchema extends IOptionallyTitled {
	id: string
	recordsets?: IRecordsetDefinition[];
}
