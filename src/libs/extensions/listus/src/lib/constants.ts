import {EnumAsUnionOfKeys} from '../../sneat-enum-keys';

export const enum ListPage {
	list = 'list',
}

export type ListPages = EnumAsUnionOfKeys<typeof ListPage>;
