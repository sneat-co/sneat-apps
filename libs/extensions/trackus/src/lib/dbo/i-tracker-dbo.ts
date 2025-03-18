import { Timestamp } from '@firebase/firestore';

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

export interface ITrackerPointBase {
	readonly ts?: Timestamp; // Time, if empty generate from id that is a UnixTime
	// readonly i?: number;
	// readonly I?: readonly number[];
	// readonly f?: number;
	// readonly F?: readonly number[];
	// readonly s?: string;
	// readonly b?: boolean;
	// readonly m?: number;
}

export interface IIntTrackerPoint extends ITrackerPointBase {
	readonly i: number;
	readonly I?: never;
	readonly f?: never;
	readonly F?: never;
	readonly s?: never;
	readonly b?: never;
	readonly m?: never;
}

export interface IIntsTrackerPoint extends ITrackerPointBase {
	readonly I: readonly number[];
	readonly i?: never;
	readonly f?: never;
	readonly F?: never;
	readonly s?: never;
	readonly b?: never;
	readonly m?: never;
}

export interface IFloatTrackerPoint extends ITrackerPointBase {
	readonly f: number;
	readonly i?: never;
	readonly I?: never;
	readonly F?: never;
	readonly s?: never;
	readonly b?: never;
	readonly m?: never;
}

export interface IFloatsTrackerPoint extends ITrackerPointBase {
	readonly F: readonly number[];
	readonly i?: never;
	readonly I?: never;
	readonly f?: never;
	readonly s?: never;
	readonly b?: never;
	readonly m?: never;
}

export interface IStringTrackerPoint extends ITrackerPointBase {
	readonly s: string;
	readonly i?: never;
	readonly I?: never;
	readonly f?: never;
	readonly F?: never;
	readonly b?: never;
	readonly m?: never;
}

export interface IBoolTrackerPoint extends ITrackerPointBase {
	readonly b: boolean;
	readonly i?: never;
	readonly I?: never;
	readonly f?: never;
	readonly F?: never;
	readonly s?: never;
	readonly m?: never;
}

export interface IMoneyTrackerPoint extends ITrackerPointBase {
	readonly m: number; // Amount in cents
	readonly i?: never;
	readonly I?: never;
	readonly f?: never;
	readonly F?: never;
	readonly s?: never;
}

export type TrackerPointBrief =
	| IIntTrackerPoint
	| IIntsTrackerPoint
	| IFloatTrackerPoint
	| IFloatsTrackerPoint
	| IStringTrackerPoint
	| IBoolTrackerPoint
	| IMoneyTrackerPoint;

// interface ITrackerPointBrief {
// 	readonly ts?: Timestamp; // Time, if empty generate from id that is a UnixTime
//
// 	// // TODO: This should be defined using TrackerPoint
// 	readonly i?: number;
// 	readonly f?: number;
// 	readonly b?: boolean;
// 	readonly s?: string;
// }

export interface ITrackerDbo extends ITrackerBrief {
	readonly entries: Readonly<
		Record<string, Readonly<Record<string, TrackerPointBrief>>>
	>;
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
