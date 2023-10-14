import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MightHaveId {
	id?: string;
}

export function mapToRecord<T extends MightHaveId>(
	state: RecordState = 'unchanged',
): OperatorFunction<T, IRecord<T>> {
	return map((dto: T): IRecord<T> => ({ id: dto.id as string, dto, state }));
}

export interface IRecord<T> {
	readonly id: string;
	readonly dto?: T;
	readonly state?: RecordState; // undefined == 'unchanged';
}

export type RecordState =
	| 'changed'
	| 'creating'
	| 'deleting'
	| 'loading'
	| 'unchanged'
	| 'updating';
