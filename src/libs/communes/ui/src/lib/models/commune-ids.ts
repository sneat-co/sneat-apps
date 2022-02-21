export type CommuneShortId = 'personal' | 'family' | string;

export interface ICommuneIds {
	readonly real?: string;
	readonly short?: CommuneShortId;
}

// tslint:disable-next-line:strict-comparisons
export const eq = <T = string | number>(x?: T, y?: T) => !x && !y || x === y;

export function equalCommuneIds(a?: ICommuneIds, b?: ICommuneIds): boolean {
	return !a && !b || !!a && !!b && eq(a.real, b.real) && eq(a.short, b.short);
}
