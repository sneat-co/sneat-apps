export type IWithStringID<T> = T & { readonly id: string };

export function mergeValuesWithIDs<T>(
	o: Record<string, T> | undefined,
): IWithStringID<T>[] {
	return o
		? Object.entries(o).map(([id, value]) => Object.assign(value, { id }))
		: [];
}
