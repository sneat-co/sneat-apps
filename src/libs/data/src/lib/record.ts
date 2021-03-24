import {map} from "rxjs/operators";
import {OperatorFunction} from "rxjs";

interface MightHaveId {
	id?: string;
}

export function mapToRecord<T extends MightHaveId>(): OperatorFunction<T, IRecord<T>> {
	return map((data: T): IRecord<T> => ({id: data.id, data}));
}

export interface IRecord<T> { // TODO: duplicate name
  id: string;
  data?: T;
  state?: RecordState;
}

export type RecordState = 'creating' | 'changed' | 'updating' | 'deleting';
