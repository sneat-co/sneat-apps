export interface ISaveEvent<T> {
	readonly object?: T;
	readonly success: () => void;
	readonly error: (e: unknown) => void;
}
