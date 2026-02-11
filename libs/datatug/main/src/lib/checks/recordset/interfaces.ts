import { IRecordsetCheckResult, IRecordsetResult } from '../../dto/execute';

export interface IRecordsetCheck {
  checkRecordsetResult(result: IRecordsetResult): IRecordsetCheckResult;
}
