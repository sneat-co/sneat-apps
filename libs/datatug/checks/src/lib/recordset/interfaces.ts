import {
	IRecordsetCheckResult,
	IRecordsetResult,
} from '@sneat/ext-datatug-dto';

export interface IRecordsetCheck {
	checkRecordsetResult(result: IRecordsetResult): IRecordsetCheckResult;
}
