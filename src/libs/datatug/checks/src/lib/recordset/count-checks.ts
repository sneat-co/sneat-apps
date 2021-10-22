import { IRecordsetCheckResult, IRecordsetResult } from '@sneat/datatug/dto';
import { IRecordsetMinCountCheckDef } from '@sneat/datatug/models';
import { IRecordsetCheck } from './interfaces';

export class RecordsetMinCountCheck implements IRecordsetCheck {
	constructor(public readonly def: IRecordsetMinCountCheckDef) {}

	public checkRecordsetResult(result: IRecordsetResult): IRecordsetCheckResult {
		if (result.rows.length > this.def.value) {
			return { def: this.def, ok: true };
		}
		return {
			def: this.def,
			ok: false,
			message: `expected no more then ${this.def.value} records, got ${result.rows.length}`,
		};
	}
}

export class RecordsetMaxCountCheck implements IRecordsetCheck {
	constructor(public readonly def: IRecordsetMinCountCheckDef) {}

	public checkRecordsetResult(result: IRecordsetResult): IRecordsetCheckResult {
		if (result.rows.length > this.def.value) {
			return { def: this.def, ok: true };
		}
		return {
			def: this.def,
			ok: false,
			message: `expected no more then ${this.def.value} records, got ${result.rows.length}`,
		};
	}
}
