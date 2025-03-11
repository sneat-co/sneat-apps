export interface ITrackerBrief {
	readonly emoji?: string;
	readonly title: string;
}

export interface IEntryBase {
	readonly t: string; // Time
	readonly n: string; // Note
}

export interface IIntEntry extends IEntryBase {
	readonly i: number;
}

export interface IIntegersEntry extends IEntryBase {
	readonly I: readonly number[];
}

export interface IFloatEntry extends IEntryBase {
	readonly f: number;
}

export interface IFloatsEntry extends IEntryBase {
	readonly F: readonly number[];
}

export interface IStringEntry extends IEntryBase {
	readonly s: string;
}

export interface IBoolEntry extends IEntryBase {
	readonly b: boolean;
}

export interface IMoneyEntry extends IEntryBase {
	readonly m: number;
}

export type TrackerEntry =
	| IIntEntry
	| IFloatEntry
	| IStringEntry
	| IBoolEntry
	| IMoneyEntry
	| IIntegersEntry;

export interface ITrackerDbo extends ITrackerBrief {
	readonly entries: readonly TrackerEntry[];
}
