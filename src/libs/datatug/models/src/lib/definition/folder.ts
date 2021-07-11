import {IProjItemBrief} from './project';

export interface IFolderItem {
	name: string
}

export interface IFolderItemWithId extends IFolderItem {
	id: string;
}

export interface IFolder extends IProjItemBrief {
	readonly boards?: { [id: string]: IFolderItem };
	readonly queries?: { [id: string]: IFolderItem };
	readonly numberOf?: { [id: string]: number };
}

export function folderItemsAsList(items: { [id: string]: IFolderItem }): IFolderItemWithId[] {
	return Object
		.keys(items)
		.map(id => ({id, name: items[id].name}))
		.sort((a, b) => a.name > b.name ? 1 : -1)
}
