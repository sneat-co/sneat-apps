import {IRecordset} from './recordset';
import {IOptionallyTitled} from '../core';

export interface ISchema extends IOptionallyTitled {
	recordsets?: IRecordset[];
}
