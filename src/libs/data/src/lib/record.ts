import { map } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

interface MightHaveId {
	id?: string;
}

export function mapToRecord<T extends MightHaveId>(
	state: RecordState = 'unchanged'
): OperatorFunction<T, IRecord<T>> {
	return map((data: T): IRecord<T> => ({ id: data.id as string, data, state }));
}

export interface IRecord<T> {
	id: string;
	data?: T;
	state?: RecordState; // undefined == 'unchanged';
}

export type RecordState =
	| 'changed'
	| 'creating'
	| 'deleting'
	| 'loading'
	| 'unchanged'
	| 'updating';
