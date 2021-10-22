import { IRecordsetCheckResult, IRecordsetResult } from '@sneat/datatug/dto';

export interface IRecordsetCheck {
	checkRecordsetResult(result: IRecordsetResult): IRecordsetCheckResult;
}
