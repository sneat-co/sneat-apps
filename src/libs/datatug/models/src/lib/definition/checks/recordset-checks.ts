export type RecordsetCheckType = 'min' | 'max';

export interface IRecordsetCheckDef {
	readonly type: RecordsetCheckType;
	readonly value: unknown;
	readonly title?: string;
}

export interface IRecordsetMinCountCheckDef extends IRecordsetCheckDef {
	type: 'min';
	value: number;
}

export interface IRecordsetMaxCountCheckDef extends IRecordsetCheckDef {
	type: 'max';
	value: number;
}
