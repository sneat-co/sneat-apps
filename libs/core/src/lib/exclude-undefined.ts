type O = { [id: string]: unknown };

export function excludeUndefined<T>(o: T): T {
	if (!o) {
		return o;
	}
	return Object.keys(o).reduce((r, k) => {
		const v = (o as unknown as O)[k];
		if (v !== undefined) {
			r[k] = v;
		}
		return r;
	}, {} as O) as unknown as T;
}

export function excludeEmpty<T>(o: T): T {
	if (!o) {
		return o;
	}
	return Object.keys(o).reduce((r, k) => {
		const v = (o as unknown as O)[k];
		if (v !== undefined && v !== '') {
			r[k] = v;
		}
		return r;
	}, {} as O) as unknown as T;
}

export function undefinedIfEmpty<T extends O>(o: T): T | undefined {
	if (!o) {
		return o;
	}
	return Object.keys(o).length === 0 ? undefined : o;
}

export function excludeZeroValues<T>(o: T): T {
	if (!o) {
		return o;
	}
	return Object.keys(o).reduce((r, k) => {
		const v = (o as unknown as O)[k];
		if (v !== undefined && v !== 0) {
			r[k] = v;
		}
		return r;
	}, {} as O) as unknown as T;
}
