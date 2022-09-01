export function excludeUndefined<T>(o: T): T {
	if (!o) {
		return o;
	}
	return Object
		.keys(o)
		.reduce(
			(r: any, k) => {
				// tslint:disable-next-line:no-any
				const v = (o as any)[k];
				if (v !== undefined) {
					r[k] = v;
				}
				return r;
			},
			{} as T,
		);
}

export function excludeEmpty<T>(o: T): T {
	if (!o) {
		return o;
	}
	return Object
		.keys(o)
		.reduce(
			(r: any, k) => {
				const v = (o as any)[k];
				if (v !== undefined && v !== '') {
					r[k] = v;
				}
				return r;
			},
			{} as T,
		);
}

export function undefinedIfEmpty<T>(o: T): T | undefined {
	if (!o) {
		return o;
	}
	return Object.keys(o as any).length === 0 ? undefined : o;
}

export function excludeZeroValues<T>(o: T): T {
	if (!o) {
		return o;
	}
	return Object
		.keys(o)
		.reduce(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(r: any, k: string) => {
				const v = (o as any)[k];
				if (v !== undefined && v !== 0) {
					r[k] = v;
				}
				return r;
			},
			{} as T,
		);
}
