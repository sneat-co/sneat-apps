import { IRecordsetCheckResults, IRecordsetResult } from '@sneat/datatug/dto';
import {
	IRecordsetCheckDef,
	IRecordsetDef,
	IRecordsetMinCountCheckDef,
} from '@sneat/datatug/models';
import { IRecordsetCheck } from './recordset/interfaces';
import {
	RecordsetMaxCountCheck,
	RecordsetMinCountCheck,
} from './recordset/count-checks';
import { newFieldCheckFromDef } from './values/mapper';

export function checkRecordsetResult(
	def: IRecordsetDef,
	result: IRecordsetResult
): IRecordsetCheckResults {
	const checks = def.checks?.map(newRecordsetCheckFromDef);
	const results: IRecordsetCheckResults = {
		recordset: checks?.map((check) => check.checkRecordsetResult(result)) || [],
		byColumn: {},
	};
	def.columns.forEach((colDef, colIndex) => {
		if (!colDef.checks?.length) {
			return;
		}
		colDef.checks.forEach((colCheckDef) => {
			const check = newFieldCheckFromDef(colCheckDef);
			result.rows.forEach((row, rowIndex) => {
				const cellCheckResult = check.checkValue(row[colIndex]);
				if (!cellCheckResult.ok) {
					let colCheckResults = results.byColumn[colIndex];
					if (!colCheckResults) {
						colCheckResults = {};
						results.byColumn[colIndex] = colCheckResults;
					}
					let rowCheckResults = colCheckResults[rowIndex];
					if (!rowCheckResults) {
						rowCheckResults = [];
						colCheckResults[rowIndex] = rowCheckResults;
					}
					colCheckResults[rowIndex].push(cellCheckResult);
				}
			});
		});
	});
	return results;
}

export const newRecordsetCheckFromDef = (
	def: IRecordsetCheckDef
): IRecordsetCheck => {
	switch (def.type) {
		case 'min':
			return new RecordsetMinCountCheck(def as IRecordsetMinCountCheckDef);
		case 'max':
			return new RecordsetMaxCountCheck(def as IRecordsetMinCountCheckDef);
		default:
			throw new Error(`unknown recordset check type: ${def.type}`);
	}
};
