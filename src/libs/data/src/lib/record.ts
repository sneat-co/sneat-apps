export interface IRecord<T> { // TODO: duplicate name
  id: string;
  data?: T;
  state?: RecordState;
}

export type RecordState = 'creating' | 'changed' | 'updating' | 'deleting';
