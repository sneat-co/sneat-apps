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

export interface ITrackerPointBase {
	readonly ts?: Timestamp; // Time, if empty generate from id that is a UnixTime
	readonly i?: number;
	readonly I?: readonly number[];
	readonly f?: number;
	readonly F?: readonly number[];
	readonly s?: string;
	readonly b?: boolean;
	readonly m?: number;
}

export interface IIntTrackerPoint extends ITrackerPointBase {
	readonly i: number;
	I?: never;
	f?: never;
	F?: never;
	s?: never;
	b?: never;
	m?: never;
}

export interface IIntsTrackerPoint extends ITrackerPointBase {
	readonly I: readonly number[];
	i?: never;
	f?: never;
	F?: never;
	s?: never;
	b?: never;
	m?: never;
}

export interface IFloatTrackerPoint extends ITrackerPointBase {
	readonly f: number;
}

export interface IFloatsTrackerPoint extends ITrackerPointBase {
	readonly F: readonly number[];
	i?: never;
	I?: never;
	f?: never;
	s?: never;
	b?: never;
	m?: never;
}

export interface IStringTrackerPoint extends ITrackerPointBase {
	readonly s: string;
	i?: never;
	I?: never;
	f?: never;
	F?: never;
	b?: never;
	m?: never;
}

export interface IBoolTrackerPoint extends ITrackerPointBase {
	readonly b: boolean;
	i?: never;
	I?: never;
	f?: never;
	F?: never;
	s?: never;
	m?: never;
}

export interface IMoneyTrackerPoint extends ITrackerPointBase {
	readonly m: number; // Amount in cents
	i?: never;
	I?: never;
	f?: never;
	F?: never;
	s?: never;
}

export type ITrackerPointBrief =
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
		Record<string, Readonly<Record<string, ITrackerPointBrief>>>
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
