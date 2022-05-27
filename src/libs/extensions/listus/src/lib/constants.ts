import { EnumAsUnionOfKeys } from '@sneat/core';

export const enum ListPage {
	list = 'list',
}

export type ListPages = EnumAsUnionOfKeys<typeof ListPage>;
