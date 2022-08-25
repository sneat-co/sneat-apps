// tslint:disable-next-line:no-any
export function excludeUndefined<T>(obj: T): T {
	const o = obj as any;
	return Object
		.keys(obj)
		.reduce(
			(r: any, k) => {
				// tslint:disable-next-line:no-any
				const v = o[k];
				if (v !== undefined) {
					r[k] = v;
				}
				return r;
			},
			// tslint:disable-next-line:no-object-literal-type-assertion
			{} as T,
		);
}

export function excludeEmpty<T>(obj: T): T {
	const o = obj as any;
	return Object
		.keys(obj)
		.reduce(
			(r: any, k) => {
				const v = o[k];
				if (v !== undefined && v !== '') {
					r[k] = v;
				}
				return r;
			},
			{} as T,
		);
}

export function undefinedIfEmpty<T>(obj: T): T | undefined {
	return Object.keys(obj).length === 0 ? undefined : obj;
}

export function excludeZeroValues<T>(obj: T): T {
	const o = obj as any;
	return Object
		.keys(obj)
		.reduce(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(r: any, k: string) => {
				const v = o[k];
				if (v !== undefined && v !== 0) {
					r[k] = v;
				}
				return r;
			},
			{} as T,
		);
}
