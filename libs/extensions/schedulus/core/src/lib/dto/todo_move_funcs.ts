export type IWithStringID<T> = T & { readonly id: string };

export function mergeValuesWithIDs<T extends object>(
	o: Record<string, T> | undefined,
): IWithStringID<T>[] {
	return o
		? (Object.entries(o).map(([id, value]) =>
				Object.assign(value as object, { id }),
			) as IWithStringID<T>[])
		: [];
}
