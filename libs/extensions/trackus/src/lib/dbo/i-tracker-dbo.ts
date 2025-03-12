import { Timestamp } from '@firebase/firestore';

export interface ITrackerBrief {
	readonly emoji?: string;
	readonly title: string;
}

export interface ITrackerEntry {
	readonly t: Timestamp; // Time
	readonly n: string; // Note
	readonly i?: number;
	readonly f?: number;
	readonly s?: string;
}

export interface IIntEntry extends ITrackerEntry {
	readonly i: number;
}

export interface IIntegersEntry extends ITrackerEntry {
	readonly I: readonly number[];
}

export interface IFloatEntry extends ITrackerEntry {
	readonly f: number;
}

export interface IFloatsEntry extends ITrackerEntry {
	readonly F: readonly number[];
}

export interface IStringEntry extends ITrackerEntry {
	readonly s: string;
}

export interface IBoolEntry extends ITrackerEntry {
	readonly b: boolean;
}

export interface IMoneyEntry extends ITrackerEntry {
	readonly m: number;
}

export type TrackerEntry =
	| ITrackerEntry
	| IIntEntry
	| IFloatEntry
	| IStringEntry
	| IBoolEntry
	| IMoneyEntry
	| IIntegersEntry;

export interface ITrackerDbo extends ITrackerBrief {
	readonly entries: Readonly<Record<string, TrackerEntry[]>>;
}
