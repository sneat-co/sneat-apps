import { Timestamp } from '@firebase/firestore';
import { IWithCreated } from '@sneat/dto';

type TrackerValueType =
	| 'int'
	| 'float'
	| 'string'
	| 'bool'
	| 'money'
	| 'integers'
	| 'floats';

export interface IWithEntryType {
	readonly trackBy: 'space' | 'contact' | 'asset';
	readonly valueType: TrackerValueType;
}

export interface ITrackerBrief extends IWithEntryType {
	readonly title: string;
	readonly emoji?: string;
}

export interface IIntEntry {
	readonly i: number;
}

export interface IIntegersEntry {
	readonly I: readonly number[];
}

export interface IFloatEntry {
	readonly f: number;
}

export interface IFloatsEntry {
	readonly F: readonly number[];
}

export interface IStringEntry {
	readonly s: string;
}

export interface IBoolEntry {
	readonly b: boolean;
}

export interface IMoneyEntry {
	readonly m: number;
}

export type TrackerValue =
	| IIntEntry
	| IFloatEntry
	| IStringEntry
	| IBoolEntry
	| IMoneyEntry
	| IIntegersEntry
	| IFloatsEntry;

export interface ITrackerEntryBrief {
	readonly ts: Timestamp; // Time

	// // TODO: This should be defined using TrackerValue
	readonly i?: number;
	readonly f?: number;
	readonly b?: boolean;
	readonly s?: string;
}

export interface ITrackerEntryDbo extends ITrackerEntryBrief, IWithCreated {}

export interface ITrackerDbo extends ITrackerBrief {
	readonly entries: Readonly<Record<string, ITrackerEntryDbo[]>>;
}

export function isStandardTracker(id: string): boolean {
	return id.startsWith('_');
}

export function getStandardTrackerTitle(id: string): string {
	switch (id) {
		case '_pull_ups':
			return 'Pull-ups';
		case '_push_ups':
			return 'Push-ups';
		default:
			if (id.startsWith('_')) {
				return id.substring(1);
			}
			return id;
	}
}
