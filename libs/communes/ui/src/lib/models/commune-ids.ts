import { eq } from '@sneat/core';

export type CommuneShortId = 'personal' | 'family' | string;

export interface ICommuneIds {
	readonly real?: string;
	readonly short?: CommuneShortId;
}

export function equalCommuneIds(a?: ICommuneIds, b?: ICommuneIds): boolean {
	return (
		(!a && !b) || (!!a && !!b && eq(a.real, b.real) && eq(a.short, b.short))
	);
}
