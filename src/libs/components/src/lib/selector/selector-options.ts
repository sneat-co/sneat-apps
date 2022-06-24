import { Observable } from 'rxjs';

export interface ISelectorOptions<T> {
	readonly items?: Observable<T[]>;
	readonly selectedItems?: T[];
	readonly max?: number;
	readonly onSelected?: (item: T[] | null) => void;
	readonly onAdded?: (item: T) => Observable<void>;
	readonly onRemoved?: (item: T) => Observable<void>;

}
